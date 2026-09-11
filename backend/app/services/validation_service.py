"""
Validation helpers for batch CSV uploads — kept separate from the model service so
input-shape/size problems are rejected before any preprocessing or inference is attempted.
"""
import io
import re
import pandas as pd

from app.config import settings, REQUIRED_COLUMNS


class BatchValidationError(ValueError):
    pass


def _strip_excel_export_artifacts(raw_bytes: bytes) -> bytes:
    """
    Excel's "CSV UTF-8" export can prepend a UTF-8 BOM, and on machines whose Windows list
    separator isn't a comma, Excel also prepends a literal `sep=,` directive line so it can
    reopen the file correctly itself. Neither is part of the actual header row, but a naive
    `pandas.read_csv` (or a naive client-side header check) treats that line *as* the header,
    which makes every required column look "missing" even though the real header two lines
    down is perfectly correct. Strip both before handing the bytes to the CSV parser.
    """
    text = raw_bytes.decode("utf-8-sig", errors="replace")
    lines = text.split("\n")
    if lines and re.match(r"^sep=.\s*\r?$", lines[0], re.IGNORECASE):
        lines = lines[1:]
    return "\n".join(lines).encode("utf-8")


def validate_csv_bytes(raw_bytes: bytes) -> pd.DataFrame:
    if len(raw_bytes) > settings.MAX_UPLOAD_BYTES:
        raise BatchValidationError(
            f"File too large ({len(raw_bytes)} bytes). Limit is {settings.MAX_UPLOAD_BYTES} bytes. "
            "Use a smaller sample (see the sample CSV download on the Batch Analysis page) — "
            "the full raw Kaggle dataset (~150 MB, 284k rows) is far larger than this demo's batch limit."
        )

    cleaned_bytes = _strip_excel_export_artifacts(raw_bytes)

    try:
        df = pd.read_csv(io.BytesIO(cleaned_bytes))
    except Exception as exc:  # noqa: BLE001
        raise BatchValidationError(f"Could not parse CSV: {exc}") from exc

    if df.empty:
        raise BatchValidationError("Uploaded CSV has no rows.")

    if len(df) > settings.MAX_BATCH_ROWS:
        raise BatchValidationError(
            f"CSV has {len(df)} rows, which exceeds the {settings.MAX_BATCH_ROWS}-row batch limit."
        )

    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise BatchValidationError(f"CSV is missing required column(s): {missing}")

    non_numeric = [c for c in REQUIRED_COLUMNS if not pd.api.types.is_numeric_dtype(df[c])]
    if non_numeric:
        raise BatchValidationError(f"Column(s) contain non-numeric values: {non_numeric}")

    if df[REQUIRED_COLUMNS].isna().any().any():
        raise BatchValidationError("CSV contains missing values in one or more required columns.")

    return df

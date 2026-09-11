"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RiskDistributionChart } from "@/components/charts/RiskDistributionChart";
import { ProbabilityHistogram } from "@/components/charts/ProbabilityHistogram";
import { FadeIn } from "@/components/effects/FadeIn";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast";
import type { BatchPredictionResult, BatchRowResult, RiskLevel, SamplesPreviewResponse } from "@/lib/types";
import { UploadCloud, Download, Search, FileSpreadsheet, Info } from "lucide-react";

const REQUIRED_COLUMNS = ["Time", ...Array.from({ length: 28 }, (_, i) => `V${i + 1}`), "Amount"];
const PAGE_SIZE = 25;
const DEFAULT_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const RISK_TONE: Record<RiskLevel, "legit" | "medium" | "fraud"> = {
  LOW: "legit",
  MEDIUM: "medium",
  HIGH: "fraud",
};

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export default function BatchPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [columnWarning, setColumnWarning] = useState<string | null>(null);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchPredictionResult | null>(null);
  const [maxUploadBytes, setMaxUploadBytes] = useState(DEFAULT_MAX_UPLOAD_BYTES);
  const [preview, setPreview] = useState<SamplesPreviewResponse | null>(null);

  const [search, setSearch] = useState("");
  const [fraudOnly, setFraudOnly] = useState(false);
  const [sortByRisk, setSortByRisk] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.config().then((c) => setMaxUploadBytes(c.max_upload_bytes)).catch(() => {});
    api.samplesPreview(5).then(setPreview).catch(() => {});
  }, []);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setResult(null);
    setError(null);
    setColumnWarning(null);
    setSizeWarning(null);
    if (!f) return;

    if (f.size > maxUploadBytes) {
      setSizeWarning(
        `This file is ${formatBytes(f.size)}, which is larger than the ${formatBytes(maxUploadBytes)} batch limit. ` +
          "Trim it down to a few thousand rows, or use the sample CSV below to test the feature.",
      );
      return;
    }

    // Read a slightly larger slice than the header alone needs, and skip any Excel export
    // artifacts (a UTF-8 BOM, and — on non-comma-locale Windows machines — a literal `sep=,`
    // directive line) before looking for the real header row. Without this, a perfectly valid
    // CSV re-saved from Excel can make every required column look "missing".
    const text = await f.slice(0, 8192).text();
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
    const headerLine = /^sep=.\s*$/i.test(lines[0] ?? "") ? lines[1] : lines[0];
    const header = headerLine?.split(",").map((h) => h.trim()) ?? [];
    const missing = REQUIRED_COLUMNS.filter((c) => !header.includes(c));
    if (missing.length > 0) {
      setColumnWarning(`Missing required column(s): ${missing.join(", ")}. Upload will likely be rejected by the server.`);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.predictBatch(file);
      setResult(res);
      setPage(1);
      toast(`Scored ${res.row_count} rows — ${res.fraud_count} flagged.`, res.fraud_count > 0 ? "error" : "success");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Batch prediction failed.";
      setError(message);
      toast(message, "error");
    } finally {
      setUploading(false);
    }
  }

  function downloadSampleCsv() {
    const a = document.createElement("a");
    a.href = api.sampleCsvUrl();
    a.download = "fraudshield_sample_transactions.csv";
    a.click();
    toast("Sample CSV download started.", "success");
  }

  const filteredResults = useMemo(() => {
    if (!result) return [];
    const filtered = result.results.filter((r) => {
      if (fraudOnly && r.prediction !== 1) return false;
      if (search && !String(r.row_index).includes(search) && !r.label.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
    if (sortByRisk) {
      return [...filtered].sort((a, b) => b.fraud_probability - a.fraud_probability);
    }
    return filtered;
  }, [result, search, fraudOnly, sortByRisk]);

  const riskCounts = useMemo(() => {
    const counts: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    result?.results.forEach((r) => {
      counts[r.risk_level] += 1;
    });
    return counts;
  }, [result]);

  const paginated = filteredResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));

  function downloadCsv() {
    if (!result) return;
    const header = "row_index,prediction,label,fraud_probability,risk_level";
    const rows = result.results.map(
      (r: BatchRowResult) => `${r.row_index},${r.prediction},${r.label},${r.fraud_probability},${r.risk_level}`,
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fraudshield_batch_predictions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV downloaded.", "success");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Batch Analysis"
        description="Upload a CSV of unseen transactions (Time, V1-V28, Amount) to score them in one request."
      />

      <FadeIn>
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <label
              htmlFor="csv-upload"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-10 text-center transition-colors hover:border-accent/50 hover:bg-accent/5"
            >
              <UploadCloud className="h-6 w-6 text-muted" aria-hidden />
              <span className="text-sm text-foreground">{file ? file.name : "Click to choose a CSV file"}</span>
              <span className="text-xs text-muted">
                Required columns: Time, V1&ndash;V28, Amount &middot; max {formatBytes(maxUploadBytes)}
              </span>
              <input id="csv-upload" type="file" accept=".csv" className="sr-only" onChange={handleFileChange} />
            </label>

            {sizeWarning && <p className="text-xs text-fraud">{sizeWarning}</p>}
            {columnWarning && <p className="text-xs text-medium">{columnWarning}</p>}

            <Button onClick={handleUpload} disabled={!file || uploading || !!sizeWarning} className="w-fit">
              {uploading ? "Running FraudShield inference..." : "Run Batch Prediction"}
            </Button>

            <p className="text-xs text-muted-2">
              Your file is read into memory for this request, scored, and the response is
              returned — the backend does not write uploaded CSVs to disk or a database. Data
              persistence beyond that is not implemented in this project.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-6">
        <Card className="border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="flex items-center gap-2 normal-case tracking-normal text-foreground">
              <FileSpreadsheet className="h-4 w-4 text-accent" aria-hidden /> Need a CSV to test with?
            </CardTitle>
            <Button variant="secondary" onClick={downloadSampleCsv} className="gap-2">
              <Download className="h-4 w-4" /> Download Sample CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <p className="flex items-start gap-2 text-sm text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              This is a small ({preview ? preview.total_rows_in_file : "~25"}-row), correctly formatted slice of
              real held-out transactions — the same ones bundled with the deployed model. It always passes
              validation, unlike the full 150&nbsp;MB raw Kaggle file, which is far larger than this demo&apos;s
              upload limit. Your own CSV just needs the same header row: exactly{" "}
              <code className="text-foreground">Time, V1&hellip;V28, Amount</code> (an extra{" "}
              <code className="text-foreground">Class</code> column is fine — it&apos;s ignored).
            </p>

            {preview && preview.rows.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-2 text-muted">
                      <th className="whitespace-nowrap py-2 px-3 font-medium">Time</th>
                      <th className="whitespace-nowrap py-2 px-3 font-medium">V1</th>
                      <th className="whitespace-nowrap py-2 px-3 font-medium">V2</th>
                      <th className="whitespace-nowrap py-2 px-3 font-medium">V3</th>
                      <th className="whitespace-nowrap py-2 px-3 font-medium text-muted-2">&hellip;</th>
                      <th className="whitespace-nowrap py-2 px-3 font-medium">V28</th>
                      <th className="whitespace-nowrap py-2 px-3 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((r, i) => (
                      <tr key={i} className="border-b border-border/60 font-tabular">
                        <td className="whitespace-nowrap py-1.5 px-3">{r.Time}</td>
                        <td className="whitespace-nowrap py-1.5 px-3">{r.V1.toFixed(3)}</td>
                        <td className="whitespace-nowrap py-1.5 px-3">{r.V2.toFixed(3)}</td>
                        <td className="whitespace-nowrap py-1.5 px-3">{r.V3.toFixed(3)}</td>
                        <td className="whitespace-nowrap py-1.5 px-3 text-muted-2">&hellip;</td>
                        <td className="whitespace-nowrap py-1.5 px-3">{r.V28.toFixed(3)}</td>
                        <td className="whitespace-nowrap py-1.5 px-3">{r.Amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <div className="mt-8">
        {error && <ErrorState message={error} />}

        {!error && !result && !uploading && (
          <EmptyState title="No batch results yet" description="Upload a CSV above to see predictions here." />
        )}

        {result && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid grid-cols-3 gap-3 sm:col-span-2 sm:grid-rows-1">
                <MetricCard label="Rows Scored" value={String(result.row_count)} />
                <MetricCard label="Flagged Fraud" value={String(result.fraud_count)} tone="fraud" />
                <MetricCard label="Threshold Used" value={formatThreshold(result.threshold_used)} tone="medium" />
              </div>
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <RiskDistributionChart counts={riskCounts} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Probability Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ProbabilityHistogram results={result.results} />
                <p className="mt-1 text-xs text-muted-2">
                  Predicted fraud probability across all {result.row_count} scored rows.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
                <input
                  placeholder="Search row # or label..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-border bg-surface-2 py-2 pl-8 pr-3 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={fraudOnly}
                    onChange={(e) => {
                      setFraudOnly(e.target.checked);
                      setPage(1);
                    }}
                  />
                  Fraud only
                </label>
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={sortByRisk}
                    onChange={(e) => {
                      setSortByRisk(e.target.checked);
                      setPage(1);
                    }}
                  />
                  Sort by highest probability
                </label>
                <Button variant="secondary" onClick={downloadCsv} className="gap-2">
                  <Download className="h-4 w-4" /> Download CSV
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="overflow-x-auto pt-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted">
                      <th className="py-2 pr-6 font-medium">Row</th>
                      <th className="py-2 pr-6 font-medium">Prediction</th>
                      <th className="py-2 pr-6 font-medium">Fraud Probability</th>
                      <th className="py-2 pr-6 font-medium">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((r) => (
                      <tr key={r.row_index} className="border-b border-border/60 transition-colors hover:bg-surface-2/40">
                        <td className="py-2 pr-6">{r.row_index}</td>
                        <td className="py-2 pr-6">{r.label}</td>
                        <td className="py-2 pr-6 font-tabular">{(r.fraud_probability * 100).toFixed(2)}%</td>
                        <td className="py-2 pr-6">
                          <Badge tone={RISK_TONE[r.risk_level]}>{r.risk_level}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex items-center justify-between text-sm text-muted">
                  <span>
                    Page {page} of {totalPages} ({filteredResults.length} rows)
                  </span>
                  <div className="flex gap-2">
                    <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                      Previous
                    </Button>
                    <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function formatThreshold(t: number): string {
  // Keep MetricCard's numeric parser happy while showing the raw threshold value.
  return String(t);
}

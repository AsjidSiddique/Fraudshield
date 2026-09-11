import type {
  Transaction,
  PredictionResult,
  ExplanationResult,
  BatchPredictionResult,
  ModelInfo,
  MetricsResponse,
  HealthResponse,
  ConfigResponse,
  SamplesResponse,
  SamplesPreviewResponse,
} from "./types";

// Never hardcode localhost in production components — always resolve from the env var,
// with a local-dev fallback only.
//
// Defensive normalization: if NEXT_PUBLIC_API_URL is set on the hosting platform without a
// "https://" (or "http://") scheme — e.g. someone pastes `fraudshield-production.up.railway.app`
// instead of `https://fraudshield-production.up.railway.app` — `fetch()` silently treats it as a
// *relative* path and sends requests to the frontend's own origin instead of the backend. That
// produces exactly the "Service Offline" / 404-on-own-domain failure mode. Normalizing here means
// a missing scheme in the dashboard can never break the app.
function normalizeApiBaseUrl(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim().replace(/\/$/, "");
  if (!trimmed) return "http://localhost:8000";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.body && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(
      "FraudShield inference service is currently unavailable.",
      0,
    );
  }

  if (!res.ok) {
    let detail = "Request failed.";
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      // ignore body parse failure
    }
    throw new ApiError(detail, res.status);
  }

  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<HealthResponse>("/health"),
  config: () => request<ConfigResponse>("/api/config"),
  model: () => request<ModelInfo>("/api/model"),
  metrics: () => request<MetricsResponse>("/api/metrics"),
  samples: () => request<SamplesResponse>("/api/samples"),
  samplesPreview: (rows = 5) => request<SamplesPreviewResponse>(`/api/samples/preview?rows=${rows}`),
  sampleCsvUrl: () => `${API_BASE_URL}/api/samples/csv`,

  predict: (transaction: Transaction) =>
    request<PredictionResult>("/api/predict", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),

  explain: (transaction: Transaction) =>
    request<ExplanationResult>("/api/explain", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),

  predictBatch: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<BatchPredictionResult>("/api/predict/batch", {
      method: "POST",
      body: formData,
    });
  },
};

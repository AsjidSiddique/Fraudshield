import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const ENDPOINTS = [
  { method: "GET", path: "/health", desc: "Service + model load status." },
  { method: "GET", path: "/api/model", desc: "Full model metadata (name, threshold, metrics, limitations)." },
  { method: "GET", path: "/api/metrics", desc: "Selected model's metrics, plus the full 4-model comparison and threshold curve, read from results/*.csv." },
  { method: "GET", path: "/api/config", desc: "Required columns, batch limits, SHAP availability, environment." },
  { method: "GET", path: "/api/samples", desc: "One real legitimate example and one real fraud example, if present in the bundled sample data." },
  { method: "GET", path: "/api/samples/preview", desc: "First N rows of the bundled sample CSV, for the Batch page's preview table." },
  { method: "GET", path: "/api/samples/csv", desc: "Downloads the bundled sample_transactions.csv verbatim." },
  { method: "POST", path: "/api/predict", desc: "Score a single transaction." },
  { method: "POST", path: "/api/predict/batch", desc: "Score a CSV of transactions (multipart/form-data)." },
  { method: "POST", path: "/api/explain", desc: "Score a transaction and return SHAP feature contributions." },
];

const ENV_VARS = [
  { name: "FRAUDSHIELD_MODELS_DIR", def: "backend/models", desc: "Where artifacts are loaded from at startup." },
  { name: "FRAUDSHIELD_ALLOWED_ORIGINS", def: "http://localhost:3000,http://127.0.0.1:3000", desc: "Comma-separated CORS allow-list — must exactly match the deployed frontend origin(s)." },
  { name: "FRAUDSHIELD_MAX_BATCH_ROWS", def: "5000", desc: "Maximum rows accepted per batch CSV upload." },
  { name: "FRAUDSHIELD_MAX_UPLOAD_BYTES", def: "10485760 (10 MB)", desc: "Maximum upload size for /api/predict/batch." },
  { name: "FRAUDSHIELD_SHAP_ENABLED", def: "true", desc: "Toggles SHAP explanation support off without redeploying a different build." },
  { name: "FRAUDSHIELD_ENV", def: "development", desc: "Reported by /api/config; does not change model behavior." },
  { name: "NEXT_PUBLIC_API_URL", def: "—", desc: "Frontend-only — base URL of the deployed FastAPI service. Must include the https:// scheme." },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Documentation"
        description="Architecture, API reference, and operational notes for the FraudShield inference service."
      />

      <Card className="mb-6 border-accent/20">
        <CardHeader><CardTitle>For researchers</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>
            FraudShield separates model training from deployment. Training and evaluation happen
            offline, in a notebook; the deployed service loads fixed model artifacts and performs
            inference only — it never retrains or refits anything at request time.
          </p>
          <div>
            <p className="mb-1 text-foreground">To reproduce the experiment:</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Obtain the public Kaggle Credit Card Fraud Detection dataset.</li>
              <li>Run preprocessing (train-only fit, see Architecture below).</li>
              <li>Train the candidate models (Logistic Regression, Random Forest, HistGradientBoosting, PyTorch MLP).</li>
              <li>Evaluate on the validation set, then once on the untouched test set.</li>
              <li>Optimize the decision threshold on the validation set.</li>
              <li>Export the artifacts (preprocessor, model, metadata) into <code className="text-foreground">backend/models/</code>.</li>
              <li>Run the FastAPI backend.</li>
              <li>Run the Next.js frontend.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Architecture</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>
            Next.js frontend → HTTPS REST → FastAPI inference service → saved model artifacts
            (preprocessor + Random Forest, loaded once at process startup) → prediction, and
            optionally a SHAP TreeExplainer for feature attribution.
          </p>
          <p>
            <strong className="text-foreground">Model training does not happen in the deployed
            application.</strong> The notebook that produced <code className="text-foreground">preprocessor.pkl</code>,{" "}
            <code className="text-foreground">random_forest.pkl</code>, and{" "}
            <code className="text-foreground">model_metadata.json</code> is run separately; the
            API only loads and serves those fixed artifacts.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>REST API</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="py-2 pr-4 font-medium">Method</th>
                <th className="py-2 pr-4 font-medium">Path</th>
                <th className="py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.path} className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono text-accent">{e.method}</td>
                  <td className="py-2 pr-4 font-mono">{e.path}</td>
                  <td className="py-2 text-muted">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-2">
            Interactive Swagger UI is auto-generated by FastAPI at{" "}
            <code className="text-foreground">/docs</code> on the API host itself (not this
            frontend route).
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Prediction API</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="mb-1 text-muted">POST /api/predict — request body (all 30 fields required)</p>
            <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 text-xs">
{`{
  "Time": 12345,
  "V1": -1.35, "V2": -0.07, ..., "V28": -0.02,
  "Amount": 149.50
}`}
            </pre>
          </div>
          <div>
            <p className="mb-1 text-muted">Response — 200</p>
            <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 text-xs">
{`{
  "prediction": 1,
  "label": "Fraud",
  "fraud_probability": 0.914,
  "risk_level": "HIGH",
  "threshold_used": 0.44
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Explainability API</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted">
            Same request body as <code className="text-foreground">/api/predict</code>. Returns
            the same underlying prediction plus SHAP feature contributions.
          </p>
          <div>
            <p className="mb-1 text-muted">POST /api/explain — response — 200</p>
            <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 text-xs">
{`{
  "prediction": {
    "prediction": 1,
    "label": "Fraud",
    "fraud_probability": 0.914,
    "risk_level": "HIGH",
    "threshold_used": 0.44
  },
  "top_increasing_risk": [
    { "feature": "V14", "contribution": 0.081 },
    { "feature": "V4", "contribution": 0.052 }
  ],
  "top_decreasing_risk": [
    { "feature": "V17", "contribution": -0.037 }
  ],
  "disclaimer": "SHAP values describe this model's behavior for this transaction. They do not establish that any feature causally caused fraud, and V1-V28 are anonymized PCA-derived features with no disclosed real-world meaning."
}`}
            </pre>
          </div>
          <p className="text-xs text-muted-2">
            Returns <code className="text-foreground">503</code> if SHAP is disabled or
            unavailable for the currently loaded model.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Batch API</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>
            <code className="text-foreground">POST /api/predict/batch</code> accepts a
            multipart CSV upload containing the same 30 required columns. Limits are enforced
            server-side, not just in the UI: max rows and max upload size come from{" "}
            <code className="text-foreground">FRAUDSHIELD_MAX_BATCH_ROWS</code> (default 5,000)
            and <code className="text-foreground">FRAUDSHIELD_MAX_UPLOAD_BYTES</code> (default
            10 MB).
          </p>
          <p>
            The response includes <code className="text-foreground">row_count</code>,{" "}
            <code className="text-foreground">fraud_count</code>,{" "}
            <code className="text-foreground">legitimate_count</code>,{" "}
            <code className="text-foreground">threshold_used</code>, and a per-row result array
            (index, prediction, label, fraud probability, risk level).
          </p>
          <p>
            An Excel quirk this endpoint specifically guards against: a leading{" "}
            <code className="text-foreground">sep=,</code> directive line (and a UTF-8 BOM) that
            Excel sometimes writes as the literal first line of a CSV — both are stripped before
            the header is parsed, on both the client-side pre-check and the server-side
            validator.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Error handling</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-2">
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["422", "Request failed schema validation — a required field is missing, wrong type, or an unexpected extra field was sent (the API rejects unknown fields rather than silently ignoring them)."],
                ["400", "Well-formed request the model/validator still couldn't process (e.g. a batch CSV with rows that fail scoring)."],
                ["503", "Model or SHAP explainer not loaded/available — the service is up but inference isn't ready."],
                ["500", "Unhandled server error. The response body is always a generic \u201cInternal server error.\u201d message — stack traces and filesystem paths are never returned to the client; details are only written to server logs."],
              ].map(([code, meaning]) => (
                <tr key={code} className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono text-accent">{code}</td>
                  <td className="py-2">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Security &amp; production-style engineering</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted">
          <p>Only the practices actually implemented in this codebase — described as &ldquo;production-style,&rdquo; not a claim of a production-hardened system:</p>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">Strict schema validation</strong> — Pydantic models with <code className="text-foreground">extra=&quot;forbid&quot;</code> reject malformed or unexpected input before it reaches the model.</li>
            <li><strong className="text-foreground">CORS allow-list</strong> — the API only accepts browser requests from origins explicitly listed in <code className="text-foreground">FRAUDSHIELD_ALLOWED_ORIGINS</code>.</li>
            <li><strong className="text-foreground">Server-side upload limits</strong> — batch row/size caps are enforced in the API, not only the UI.</li>
            <li><strong className="text-foreground">Generic error responses</strong> — no stack traces, file paths, or internal exception messages are ever sent to the client.</li>
            <li><strong className="text-foreground">Frontend/backend separation</strong> — the Next.js app never touches model artifacts directly; all inference goes through the REST API.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Reproducibility</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted">
          <p>Dataset: public Kaggle Credit Card Fraud Detection dataset. Training/evaluation code: the project notebook (not part of the deployed service). Artifacts checked into <code className="text-foreground">backend/models/</code>: preprocessor, trained model, metadata, and the raw <code className="text-foreground">results/*.csv</code> files this documentation and the Research page read their numbers from.</p>
          <p>Fixed <code className="text-foreground">random_state = 42</code> is used for the train/validation/test split. Backend integration tests live in <code className="text-foreground">backend/tests/</code>.</p>
          <p>See the project README for local setup, and the Research page for the full methodology.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Environment variables</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-2">
                <th className="py-2 pr-4 font-medium">Variable</th>
                <th className="py-2 pr-4 font-medium">Default</th>
                <th className="py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {ENV_VARS.map((v) => (
                <tr key={v.name} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-4 font-mono text-accent">{v.name}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-muted">{v.def}</td>
                  <td className="py-2 text-muted">{v.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-muted">
            V1&ndash;V28 are anonymized PCA-derived features from the original dataset owners and
            carry no disclosed real-world meaning.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

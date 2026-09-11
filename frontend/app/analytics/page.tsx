"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ModelComparisonChart } from "@/components/charts/ModelComparisonChart";
import { ThresholdCostChart } from "@/components/charts/ThresholdCostChart";
import { api, ApiError, API_BASE_URL } from "@/lib/api";
import type { MetricsResponse, ModelInfo } from "@/lib/types";

function roleForModel(name: string): string {
  if (name === "Random Forest") return "Selected";
  if (name === "Logistic Regression") return "Baseline";
  return "Candidate";
}

const FIGURES = [
  { file: "roc_curves.png", title: "ROC curves", note: "All four candidate models, test set." },
  { file: "precision_recall_curves.png", title: "Precision-Recall curves", note: "Why PR-AUC was used for selection." },
  { file: "confusion_matrix_rf.png", title: "Confusion matrix — Random Forest", note: "At the selected threshold (0.44)." },
  { file: "threshold_analysis.png", title: "Threshold analysis", note: "Precision/recall/cost across candidate thresholds." },
  { file: "model_comparison.png", title: "Model comparison", note: "Visual form of the table above." },
  { file: "class_distribution.png", title: "Class distribution", note: "Fraud vs. legitimate, ~0.17% positive." },
  { file: "correlation_matrix.png", title: "Feature correlation matrix", note: "V1–V28 (PCA components) + Time + Amount." },
  { file: "shap_summary.png", title: "SHAP summary plot", note: "Global feature importance for Random Forest." },
];

function FigureCard({ file, title, note }: { file: string; title: string; note: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-2/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${API_BASE_URL}/figures/${file}`}
        alt={title}
        className="w-full bg-surface-2 object-contain"
        loading="lazy"
        onError={() => setBroken(true)}
      />
      <div className="p-3">
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{note}</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [model, setModel] = useState<ModelInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.metrics(), api.model()])
      .then(([m, mod]) => {
        setMetrics(m);
        setModel(mod);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Model Performance"
        description="Fraud detection is evaluated using imbalance-aware metrics; accuracy alone can be misleading when fraud is roughly 0.17% of all transactions."
      />

      {loading && (
        <div className="grid gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-64" />
        </div>
      )}

      {!loading && (error || !metrics) && (
        <ErrorState message={error || "FraudShield inference service is currently unavailable."} />
      )}

      {!loading && metrics && (
        <div className="flex flex-col gap-6">
          {metrics.model_comparison && (
            <Card>
              <CardHeader>
                <CardTitle>Model Comparison — Precision / Recall / F1 / PR-AUC / ROC-AUC</CardTitle>
              </CardHeader>
              <CardContent>
                <ModelComparisonChart data={metrics.model_comparison} />
              </CardContent>
            </Card>
          )}

          {metrics.model_comparison && (
            <Card>
              <CardHeader>
                <CardTitle>Full Comparison Table</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted">
                      {Object.keys(metrics.model_comparison[0]).map((k) => (
                        <th key={k} className="whitespace-nowrap py-2 pr-6 font-medium">
                          {k}
                        </th>
                      ))}
                      <th className="whitespace-nowrap py-2 pr-6 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.model_comparison.map((row) => (
                      <tr key={row.Model} className="border-b border-border/60">
                        {Object.entries(row).map(([k, v]) => (
                          <td key={k} className="whitespace-nowrap py-2 pr-6">
                            {typeof v === "number" ? v.toFixed(4) : v}
                          </td>
                        ))}
                        <td className="whitespace-nowrap py-2 pr-6">
                          <span
                            className={
                              roleForModel(row.Model) === "Selected"
                                ? "rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent"
                                : "text-muted-2"
                            }
                          >
                            {roleForModel(row.Model)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 rounded-lg border border-border bg-surface-2/50 p-3 text-xs leading-relaxed text-muted">
                  <strong className="text-foreground">Why wasn&apos;t the highest-ROC-AUC model selected?</strong>{" "}
                  The PyTorch MLP has the highest ROC-AUC and the lowest illustrative business
                  cost of the four candidates, but a substantially lower PR-AUC than Random
                  Forest. Because this project prioritizes performance on the rare fraud class,
                  PR-AUC was weighted more heavily than ROC-AUC or cost alone during selection —
                  see the <a href="/research" className="link-underline text-accent">Research page</a> for the full reasoning.
                </p>
              </CardContent>
            </Card>
          )}

          {metrics.threshold_curve && model && (
            <Card>
              <CardHeader>
                <CardTitle>Business Cost vs. Decision Threshold — {model.model_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ThresholdCostChart data={metrics.threshold_curve} selectedThreshold={model.optimal_threshold} />
                <p className="mt-3 text-xs text-muted">
                  Business Cost = FN &times; {model.cost_fn} + FP &times; {model.cost_fp} (illustrative,
                  configurable business assumptions — not verified real banking figures).
                </p>
                <p className="mt-2 text-xs text-foreground">
                  The threshold is a property of the decision policy, not an intrinsic property of
                  the classifier — the same trained model can be operated at a different
                  threshold under different cost assumptions.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Why PR-AUC?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              With fraud at roughly 0.17% of transactions, ROC-AUC stays deceptively high even for a
              mediocre model because the false-positive <em>rate</em> looks tiny against such a large
              negative class. PR-AUC compares precision directly against recall on the rare class, so it
              reflects real-world usefulness far more faithfully than accuracy or ROC-AUC alone — this is
              why model selection in this project prioritizes PR-AUC.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Figures from training &amp; evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted">
                Generated by the training notebook and served directly from the deployed
                artifacts — not recreated or redrawn for this page.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {FIGURES.map((f) => (
                  <FigureCard key={f.file} {...f} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

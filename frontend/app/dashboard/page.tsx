"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ModelComparisonChart } from "@/components/charts/ModelComparisonChart";
import { api, ApiError } from "@/lib/api";
import type { ModelInfo, MetricsResponse, HealthResponse, ConfigResponse } from "@/lib/types";
import { formatPercent } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [model, setModel] = useState<ModelInfo | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.model(), api.metrics(), api.health().catch(() => null), api.config().catch(() => null)])
      .then(([m, met, h, c]) => {
        setModel(m);
        setMetrics(met);
        setHealth(h);
        setConfig(c);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <PageHeader title="Dashboard" description="Real-time model information from FraudShield's inference service." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <PageHeader title="Dashboard" />
        <ErrorState message={error || "FraudShield inference service is currently unavailable."} />
      </div>
    );
  }

  const fm = model.final_metrics;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Dashboard"
        description="How FraudShield makes a decision: prediction probability &rarr; decision threshold &rarr; classification &rarr; explanation. Every value below comes live from model_metadata.json via the API."
      />

      <Card className="mb-8">
        <CardContent className="flex flex-wrap items-center gap-3 pt-6 text-sm">
          <span className="font-tabular text-muted">probability {formatPercent(0.38, 0)}</span>
          <span className="text-muted-2" aria-hidden>&rarr;</span>
          <span className="font-tabular text-muted">threshold {formatPercent(model.optimal_threshold, 0)}</span>
          <span className="text-muted-2" aria-hidden>&rarr;</span>
          <Badge tone="legit">LEGITIMATE</Badge>
          <span className="ml-auto text-xs text-muted-2">
            (0.38 &lt; {model.optimal_threshold.toFixed(2)} — a worked example, not a live prediction)
          </span>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Model" value={model.model_name} tone="accent" />
        <MetricCard label="Version" value={model.project_version} tone="accent" />
        <MetricCard label="Decision Threshold" value={model.optimal_threshold.toFixed(2)} tone="medium" />
        <MetricCard label="PR-AUC" value={String(fm["PR-AUC"] ?? fm["pr_auc"] ?? "—")} tone="legit" />
        <MetricCard label="ROC-AUC" value={String(fm["ROC-AUC"] ?? fm["roc_auc"] ?? "—")} tone="legit" />
        <MetricCard label="Precision" value={String(fm["Precision"] ?? fm["precision"] ?? "—")} />
        <MetricCard label="Recall" value={String(fm["Recall"] ?? fm["recall"] ?? "—")} />
        <MetricCard label="F1" value={String(fm["F1"] ?? fm["f1"] ?? "—")} />
        <MetricCard label="False Positives" value={String(fm["FP"] ?? "—")} tone="medium" />
        <MetricCard label="False Negatives" value={String(fm["FN"] ?? "—")} tone="fraud" />
      </div>
      <p className="mt-2 text-xs text-muted-2">
        Decision threshold selected on the validation set using the project&apos;s illustrative
        cost function and a minimum-recall constraint (see{" "}
        <Link href="/research" className="link-underline text-accent">Research</Link>).
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Why these metrics?</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {[
              { term: "PR-AUC — primary metric", def: "Performance on the rare fraud class, accounting for the precision/recall trade-off." },
              { term: "Recall", def: "Of actual fraud transactions, how many did the model detect?" },
              { term: "Precision", def: "Of transactions flagged as fraud, how many were actually fraud?" },
              { term: "F1", def: "Harmonic balance between precision and recall." },
              { term: "ROC-AUC", def: "Useful for ranking discrimination, but less informative alone under this level of class imbalance." },
            ].map((m) => (
              <div key={m.term}>
                <dt className="text-xs font-medium text-foreground">{m.term}</dt>
                <dd className="mt-0.5 text-xs text-muted">{m.def}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted">
            <strong className="text-foreground">Metric caveat:</strong> these are test-set results
            for this historical dataset. They should not be interpreted as expected performance on
            modern banking transactions.
          </p>
        </CardContent>
      </Card>

      {metrics?.model_comparison && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Model Comparison (Test Set)</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelComparisonChart data={metrics.model_comparison} />
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "API", ok: !!health, detail: health?.status ?? "unreachable" },
              { label: "Model", ok: !!health?.model_loaded, detail: health?.model_loaded ? "loaded" : "not loaded" },
              { label: "SHAP", ok: !!config?.shap_enabled, detail: config?.shap_enabled ? "enabled" : "disabled" },
              { label: "Batch inference", ok: !!config, detail: config ? `${config.max_batch_rows} row cap` : "unknown" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-surface-2/40 p-3">
                <p className="text-xs text-muted-2">{s.label}</p>
                <Badge tone={s.ok ? "legit" : "fraud"} className="mt-2">
                  {s.ok ? "OK" : "Unavailable"}
                </Badge>
                <p className="mt-1.5 text-xs text-muted">{s.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-2">
            Every value above is read live from <code className="text-foreground">/health</code> and{" "}
            <code className="text-foreground">/api/config</code> — nothing here is hardcoded.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Preprocessing</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">{model.preprocessing_description}</CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Limitations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted">
            {model.limitations.map((l) => (
              <li key={l} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-2" aria-hidden />
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-2">
            Read live from <code className="text-foreground">/api/model</code>&apos;s{" "}
            <code className="text-foreground">limitations</code> field.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Link href="/research">
          <Button variant="secondary" className="gap-2">
            Full research &amp; methodology <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

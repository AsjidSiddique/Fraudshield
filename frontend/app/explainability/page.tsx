"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TransactionForm } from "@/components/prediction/TransactionForm";
import { ResultCard } from "@/components/prediction/ResultCard";
import { ContributionChart } from "@/components/explainability/ContributionChart";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { addHistoryEntry } from "@/lib/history";
import { useToast } from "@/lib/toast";
import type { PredictionResult, SamplesResponse, ExplanationResult, ConfigResponse, Transaction } from "@/lib/types";
import { BrainCircuit } from "lucide-react";

export default function ExplainabilityPage() {
  const { toast } = useToast();
  const [samples, setSamples] = useState<SamplesResponse | null>(null);
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.samples().catch(() => null), api.config().catch(() => null)])
      .then(([s, c]) => {
        setSamples(s);
        setConfig(c);
      })
      .finally(() => setLoadingMeta(false));
  }, []);

  function handleResult(res: PredictionResult | null, tx: Transaction | null, err: string | null) {
    setResult(res);
    setError(err);
    if (res && tx) {
      addHistoryEntry(res, tx, "explain");
    } else if (err) {
      toast(err, "error");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Explainability"
        description="SHAP shows which anonymized model features pushed a prediction toward fraud (red) or toward legitimate (green)."
      />

      {loadingMeta ? (
        <Skeleton className="mb-6 h-10 w-full" />
      ) : config && !config.shap_enabled ? (
        <div className="mb-6">
          <ErrorState message="SHAP explainability is not available for the currently loaded model." />
        </div>
      ) : null}

      <Card className="mb-6">
        <CardContent className="space-y-3 pt-6 text-sm leading-relaxed text-muted">
          <h2 className="text-sm font-semibold text-foreground">How to read this</h2>
          <p>
            FraudShield uses a <strong className="text-foreground">SHAP TreeExplainer</strong>{" "}
            on the deployed Random Forest. For a given transaction, SHAP attributes the gap
            between the model&apos;s prediction and its average prediction across the training
            data to each individual feature.
          </p>
          <ul className="space-y-1.5">
            <li>
              <span className="text-fraud font-medium">Positive contribution</span> — this
              feature&apos;s value pushed the fraud probability <em>up</em> for this transaction,
              relative to the model&apos;s baseline.
            </li>
            <li>
              <span className="text-legit font-medium">Negative contribution</span> — this
              feature&apos;s value pushed the fraud probability <em>down</em>.
            </li>
          </ul>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface-2/50 p-3 text-xs">
              <p className="font-medium text-foreground">Global explanation</p>
              <p className="mt-1 text-muted">
                Which features does the model generally rely on across the evaluation data? See
                the SHAP summary plot on the{" "}
                <a href="/analytics" className="link-underline text-accent">Model Performance</a>{" "}
                page.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2/50 p-3 text-xs">
              <p className="font-medium text-foreground">Local explanation</p>
              <p className="mt-1 text-muted">
                Which features influenced this particular prediction? That&apos;s what the tool
                below computes, for the transaction you submit.
              </p>
            </div>
          </div>
          <p className="rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs">
            <strong className="text-foreground">What SHAP does not mean:</strong> a contribution
            describes this model&apos;s behavior on this input — it is not evidence that the
            feature caused fraud, and it does not generalize to a rule like &ldquo;high V14 means
            fraud.&rdquo; V1&ndash;V28 are anonymized PCA components with no disclosed
            correspondence to real transaction attributes (location, merchant, device, etc.), so
            no business meaning is assigned to any of them here — only their statistical
            contribution to this specific model&apos;s output.
          </p>
        </CardContent>
      </Card>

      <TransactionForm
        mode="explain"
        samples={samples}
        onResult={handleResult}
        onExplanation={setExplanation}
      />

      <div className="mt-8 flex flex-col gap-6">
        {error && <ErrorState message={error} />}
        {result && <ResultCard result={result} />}

        {explanation ? (
          <Card>
            <CardHeader>
              <CardTitle>Top Contributing Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ContributionChart
                increasing={explanation.top_increasing_risk}
                decreasing={explanation.top_decreasing_risk}
              />
              <p className="mt-4 text-xs text-muted">{explanation.disclaimer}</p>
            </CardContent>
          </Card>
        ) : (
          !result &&
          !error && (
            <EmptyState
              icon={<BrainCircuit className="h-8 w-8 text-muted" aria-hidden />}
              title="No explanation yet"
              description="Submit a transaction above to see which features drove FraudShield's prediction."
            />
          )
        )}
      </div>
    </div>
  );
}

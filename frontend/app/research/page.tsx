import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { FadeIn } from "@/components/effects/FadeIn";
import { Button } from "@/components/ui/Button";
import { ArrowRight, FlaskConical } from "lucide-react";

const MODEL_COMPARISON = [
  { model: "Logistic Regression", threshold: 0.99, precision: 0.6696, recall: 0.7895, f1: 0.7246, rocAuc: 0.9549, prAuc: 0.6761, fp: 37, fn: 20, cost: 237, role: "Baseline" },
  { model: "Random Forest", threshold: 0.44, precision: 0.8690, recall: 0.7684, f1: 0.8156, rocAuc: 0.9428, prAuc: 0.8027, fp: 11, fn: 22, cost: 231, selected: true, role: "Selected" },
  { model: "HistGradientBoosting", threshold: 0.6, precision: 0.6348, recall: 0.7684, f1: 0.6952, rocAuc: 0.9209, prAuc: 0.6886, fp: 42, fn: 22, cost: 262, role: "Candidate" },
  { model: "PyTorch MLP", threshold: 0.99, precision: 0.8132, recall: 0.7789, f1: 0.7957, rocAuc: 0.9599, prAuc: 0.6829, fp: 17, fn: 21, cost: 227, role: "Candidate" },
];

const STEPS = [
  {
    n: "01",
    title: "Problem",
    body: "Detect fraudulent credit card transactions in a dataset where fraud is extremely rare relative to legitimate activity, and where the cost of missing fraud differs from the cost of wrongly flagging a legitimate transaction.",
  },
  {
    n: "02",
    title: "Dataset",
    body: "The public Kaggle Credit Card Fraud Detection dataset: 284,807 transactions made by European cardholders over two days in September 2013. Before de-duplication, 492 transactions (0.173%) are labeled fraud. Features are Time, Amount, and V1–V28 — the latter are the output of a PCA transformation applied by the original data owners for confidentiality, so they carry no disclosed real-world meaning.",
  },
  {
    n: "03",
    title: "Data quality",
    body: "1,081 exact duplicate rows were found in the raw data (19 of them labeled fraud), reducing the working dataset to 283,726 rows after de-duplication — 473 fraud (0.167%). No missing values, infinite values, or negative amounts were present.",
  },
  {
    n: "04",
    title: "Preprocessing",
    body: "A scikit-learn ColumnTransformer fit only on the training split: Time and V1–V28 are mean-imputed then standardized; Amount is median-imputed, log1p-transformed (to compress its heavy right skew), then standardized. Fitting the transformer on training data only — and applying it unchanged to validation/test — prevents information from later splits from leaking into preprocessing.",
  },
  {
    n: "05",
    title: "Splitting",
    body: "80% train / test split, with the remaining 20% further split 75/25 into validation and test (random_state = 42, fixed for reproducibility). The decision threshold was optimized on the validation set only, and the final metrics reported throughout this project were computed once on the untouched test set — the test set was never used to tune the threshold or choose between candidate models.",
  },
  {
    n: "06",
    title: "Imbalance handling & candidate models",
    body: "Because fraud is ~0.17% of transactions, a model that predicts \"legitimate\" for everything would already score >99.8% accuracy while being useless — this is why the project does not select a model on accuracy alone. Four candidates were trained on SMOTE-resampled or cost-sensitively class-weighted training data (model-dependent): Logistic Regression, Random Forest, HistGradientBoosting, and a PyTorch MLP.",
  },
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Research &amp; Methodology"
        description="How FraudShield's dataset, preprocessing, model selection, and decision threshold were built — and where the evidence stops."
      />

      <FadeIn>
        <Card className="glow-accent border-accent/30">
          <CardContent className="space-y-2 pt-6">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden /> Research question
            </div>
            <p className="text-base text-foreground sm:text-lg">
              How can a fraud detection system make useful decisions under extreme class
              imbalance while explicitly accounting for the different costs of false positives
              and false negatives?
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Quick-scan chain */}
      <FadeIn delay={0.02} className="mt-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 rounded-xl border border-border bg-surface-2/40 px-4 py-3 font-tabular text-xs text-muted">
          {["284,807 rows", "4 candidate models", "PR-AUC 0.803", "threshold 0.44", "SHAP", "deployed API"].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-foreground">{step}</span>
              {i < arr.length - 1 && <span aria-hidden>&rarr;</span>}
            </span>
          ))}
        </div>
      </FadeIn>

      {/* Pipeline visual */}
      <FadeIn delay={0.03} className="mt-6">
        <div className="rounded-xl border border-border bg-surface-2/30 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-2">Pipeline</p>
          <div className="flex flex-wrap items-stretch gap-x-1 gap-y-3">
            {[
              { n: "01", title: "Data", detail: "284,807 rows, 0.173% fraud" },
              { n: "02", title: "Preprocessing", detail: "ColumnTransformer, train-only fit" },
              { n: "03", title: "Candidate models", detail: "LR / RF / HGB / MLP" },
              { n: "04", title: "Model selection", detail: "PR-AUC + cost" },
              { n: "05", title: "Decision", detail: "RF, threshold = 0.44" },
              { n: "06", title: "Explainability", detail: "SHAP TreeExplainer" },
              { n: "07", title: "Deployment", detail: "FastAPI + Next.js" },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center gap-1">
                <div className="w-[124px] rounded-lg border border-border bg-surface px-2.5 py-2">
                  <p className="font-tabular text-[10px] text-muted-2">{s.n}</p>
                  <p className="text-xs font-medium text-foreground">{s.title}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-muted">{s.detail}</p>
                </div>
                {i < arr.length - 1 && <span className="text-muted-2" aria-hidden>&rarr;</span>}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <div className="mt-8 space-y-4">
        {STEPS.map((s, i) => (
          <FadeIn key={s.n} delay={0.04 * i}>
            <Card>
              <CardContent className="flex gap-4 pt-6">
                <span className="shrink-0 font-tabular text-sm text-muted-2">{s.n}</span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      {/* Model comparison */}
      <FadeIn className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Model comparison</h2>
        <p className="mt-1 text-sm text-muted">
          All four candidates, evaluated on the held-out test set at each model&apos;s own
          selected threshold. Random Forest was selected for deployment because it achieved the
          highest PR-AUC among the evaluated candidates (0.803), while also achieving competitive
          business cost (231) under the project&apos;s illustrative cost assumptions.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-2">
              <tr>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Threshold</th>
                <th className="px-4 py-3 font-medium">Precision</th>
                <th className="px-4 py-3 font-medium">Recall</th>
                <th className="px-4 py-3 font-medium">F1</th>
                <th className="px-4 py-3 font-medium">ROC-AUC</th>
                <th className="px-4 py-3 font-medium">PR-AUC</th>
                <th className="px-4 py-3 font-medium">FP</th>
                <th className="px-4 py-3 font-medium">FN</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="font-tabular">
              {MODEL_COMPARISON.map((m) => (
                <tr
                  key={m.model}
                  className={m.selected ? "border-t border-border bg-accent/5" : "border-t border-border"}
                >
                  <td className="px-4 py-3 font-sans">{m.model}</td>
                  <td className="px-4 py-3">{m.threshold.toFixed(2)}</td>
                  <td className="px-4 py-3">{m.precision.toFixed(3)}</td>
                  <td className="px-4 py-3">{m.recall.toFixed(3)}</td>
                  <td className="px-4 py-3">{m.f1.toFixed(3)}</td>
                  <td className="px-4 py-3">{m.rocAuc.toFixed(3)}</td>
                  <td className="px-4 py-3">{m.prAuc.toFixed(3)}</td>
                  <td className="px-4 py-3">{m.fp}</td>
                  <td className="px-4 py-3">{m.fn}</td>
                  <td className="px-4 py-3">{m.cost}</td>
                  <td className="px-4 py-3 font-sans">
                    <span
                      className={
                        m.role === "Selected"
                          ? "rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent"
                          : "text-muted-2"
                      }
                    >
                      {m.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-2">
          Values are the exact contents of{" "}
          <code className="text-foreground">backend/models/results/model_comparison.csv</code>.
          &ldquo;Cost&rdquo; = FN×COST_FN + FP×COST_FP (see below).
        </p>

        <div className="mt-4 rounded-lg border border-border bg-surface-2/50 p-4 text-sm leading-relaxed text-muted">
          <p className="mb-1.5 text-sm font-semibold text-foreground">
            Why wasn&apos;t the model with the highest ROC-AUC selected?
          </p>
          <p>
            The PyTorch MLP achieved the highest ROC-AUC (0.960) and the lowest illustrative
            business cost of the four candidates (227), while Random Forest scored 0.943 ROC-AUC
            and a slightly higher cost (231). But the MLP&apos;s PR-AUC (0.683) was substantially
            below Random Forest&apos;s (0.803). Because this project prioritizes performance on
            the rare fraud class over a single aggregate metric, PR-AUC was given greater weight
            during model selection than ROC-AUC or the illustrative cost figure alone — this is
            an explicit trade-off, not an oversight. Different evaluation objectives lead to
            different model choices; FraudShield prioritizes the rare-class precision&ndash;recall
            trade-off rather than optimizing any single headline number.
          </p>
        </div>
      </FadeIn>

      {/* What changed the decision */}
      <FadeIn className="mt-6" delay={0.045}>
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm leading-relaxed text-muted">
            <h2 className="text-base font-semibold text-foreground">
              Probability vs. classification: what changed the decision?
            </h2>
            <p>
              The model itself only outputs a fraud probability. Turning that probability into a
              FRAUD / LEGITIMATE label is a separate step — comparing it against the decision
              threshold:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-legit/30 bg-legit/5 p-3 font-tabular text-xs">
                <p>probability = 0.38</p>
                <p>threshold = 0.44</p>
                <p className="mt-1 text-foreground">0.38 &lt; 0.44 &rarr; <strong>LEGITIMATE</strong></p>
              </div>
              <div className="rounded-lg border border-fraud/30 bg-fraud/5 p-3 font-tabular text-xs">
                <p>probability = 0.61</p>
                <p>threshold = 0.44</p>
                <p className="mt-1 text-foreground">0.61 &ge; 0.44 &rarr; <strong>FRAUD</strong></p>
              </div>
            </div>
            <p className="text-xs text-muted-2">
              The <a href="/predict" className="link-underline text-accent">live prediction page</a>{" "}
              lets you move this threshold yourself and see the classification change for a real
              prediction.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Why PR-AUC */}
      <FadeIn className="mt-10" delay={0.05}>
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm leading-relaxed text-muted">
            <h2 className="text-base font-semibold text-foreground">
              Why PR-AUC, not accuracy or ROC-AUC alone
            </h2>
            <p>
              With fraud at ~0.17% of transactions, a model predicting &ldquo;legitimate&rdquo;
              for every row would score 99.83% accuracy while catching zero fraud — accuracy
              cannot distinguish a useful model from a useless one here. ROC-AUC is computed
              against the true-negative rate, which is dominated by the huge legitimate class and
              stays high almost regardless of how well the model handles the rare positive class.
              Precision-Recall AUC is computed only over the positive (fraud) class and the
              model&apos;s false-positive behavior, which makes it far more sensitive to
              performance on the minority class this project actually cares about.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Cost-sensitive threshold */}
      <FadeIn className="mt-6" delay={0.08}>
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm leading-relaxed text-muted">
            <h2 className="text-base font-semibold text-foreground">Cost-sensitive threshold</h2>
            <p>
              A default probability cutoff of 0.50 has no special status — it only reflects equal
              cost for both error types, which is rarely true for fraud. This project instead
              minimizes an explicit cost function over a grid of candidate thresholds on the
              validation set:
            </p>
            <pre className="overflow-x-auto rounded-lg bg-surface-2 px-4 py-3 font-tabular text-xs text-foreground">
              cost = FN × COST_FN + FP × COST_FP
            </pre>
            <p>
              with <code className="text-foreground">COST_FN = 10</code> and{" "}
              <code className="text-foreground">COST_FP = 1</code> — i.e. missing one fraud case
              is treated as ten times more costly than wrongly flagging one legitimate
              transaction — subject to a minimum recall of 0.75. For Random Forest this selects a
              threshold of <strong className="text-foreground">0.44</strong>, yielding 11 false
              positives and 22 false negatives on the test set (business cost 231). The PyTorch
              MLP reaches a slightly lower cost (227) at its own threshold, but with a much lower
              PR-AUC — see the model-comparison discussion above.
            </p>
            <p className="text-foreground">
              The threshold is a property of the decision policy, not an intrinsic property of
              the classifier — the same trained model can be operated at any threshold, and the
              choice of 0.44 reflects this project&apos;s cost assumptions, not a fixed
              characteristic of Random Forest.
            </p>
            <p className="rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs">
              <strong className="text-foreground">Important:</strong> COST_FN and COST_FP are
              illustrative assumptions chosen for this project, not figures obtained from a real
              financial institution. The optimal threshold would change under different cost
              assumptions.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Limitations */}
      <FadeIn className="mt-10" delay={0.1}>
        <h2 className="text-lg font-semibold text-foreground">Limitations &amp; threats to validity</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Dataset validity",
              items: [
                "Fixed historical snapshot — European cardholders, September 2013.",
                "V1–V28 are anonymized PCA-derived features with no disclosed real-world meaning; no business interpretation is assigned to them anywhere in this project.",
              ],
            },
            {
              title: "Evaluation validity",
              items: [
                "Train/validation/test split is random, not temporal — concept drift over time was not evaluated.",
                "COST_FN and COST_FP, and the resulting decision threshold, are illustrative assumptions, not verified figures from a bank or payment processor.",
              ],
            },
            {
              title: "Deployment validity",
              items: [
                "No validation against live transaction traffic.",
                "No continuous monitoring or periodic retraining — not production-ready for real banking use without further work.",
              ],
            },
          ].map((cat) => (
            <div key={cat.title} className="rounded-lg border border-border bg-surface-2/40 p-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-2">{cat.title}</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted">
                {cat.items.map((l) => (
                  <li key={l} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-2" aria-hidden />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* What I would do differently */}
      <FadeIn className="mt-10" delay={0.11}>
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm leading-relaxed text-muted">
            <h2 className="text-base font-semibold text-foreground">If I extended this study</h2>
            <p>
              The next experimental step would be temporal evaluation rather than relying solely
              on a random split, since fraud distributions can change over time and a random
              split cannot reveal that. I would also test probability calibration, adaptive
              thresholds that respond to changing cost assumptions, concept-drift detection, and
              periodic retraining — none of which the current version of FraudShield implements
              or claims to.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* What I learned */}
      <FadeIn className="mt-10" delay={0.12}>
        <h2 className="text-lg font-semibold text-foreground">What this project taught me</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
          {[
            "Accuracy can be actively misleading under severe class imbalance — it has to be paired with PR-AUC and a confusion-matrix breakdown to mean anything.",
            "Model selection should follow the actual objective (minimizing business cost here), not whichever single metric happens to look best.",
            "A 0.5 decision threshold is a default, not a result — it should reflect the real asymmetry between error types.",
            "Explainability outputs need careful framing: SHAP describes what the model used, not what caused the outcome.",
            "Preventing data leakage during preprocessing (fitting transforms on training data only) is easy to get wrong and easy to overlook.",
            "Shipping a model is a small part of an ML system — validation, error handling, and honest UX around a deployed API took at least as much work.",
          ].map((l) => (
            <li key={l} className="flex gap-2 rounded-lg border border-border bg-surface/60 p-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
              {l}
            </li>
          ))}
        </ul>
      </FadeIn>

      {/* Future research */}
      <FadeIn className="mt-10" delay={0.14}>
        <h2 className="text-lg font-semibold text-foreground">Where this project could go next</h2>
        <p className="mt-1 text-sm text-muted">
          Potential future research directions, framed as open questions — not claims of
          completed work.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {[
            "How does fraud-detection performance degrade under temporal concept drift, and how quickly?",
            "How should the decision threshold adapt when false-negative/false-positive cost assumptions change, or are uncertain?",
            "How stable are SHAP explanations for the same model under distribution shift?",
            "Can probability calibration (e.g. Platt scaling, isotonic regression) improve cost-sensitive decisions beyond raw classifier scores?",
            "How can explainability be evaluated more rigorously than visual inspection of SHAP plots?",
          ].map((l) => (
            <li key={l} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-2" aria-hidden />
              {l}
            </li>
          ))}
        </ul>
      </FadeIn>

      {/* References */}
      <FadeIn className="mt-10" delay={0.16}>
        <h2 className="text-lg font-semibold text-foreground">References</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-muted">
          {[
            "Dal Pozzolo, A. et al. — Credit Card Fraud Detection dataset (Worldline / ULB Machine Learning Group), distributed via Kaggle.",
            "Chawla, N. V. et al. — SMOTE: Synthetic Minority Over-sampling Technique (JAIR, 2002), used for the imbalance-handling strategy.",
            "Lundberg, S. & Lee, S. — A Unified Approach to Interpreting Model Predictions (SHAP), NeurIPS 2017.",
            "Pedregosa, F. et al. — Scikit-learn: Machine Learning in Python (JMLR, 2011) — used for preprocessing, Logistic Regression, Random Forest, and HistGradientBoosting.",
          ].map((r) => (
            <li key={r} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-2" aria-hidden />
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-2">
          Listed because each corresponds to something actually used in this project, not as a
          general reading list.
        </p>
      </FadeIn>

      <FadeIn delay={0.18} className="mt-12 flex flex-wrap gap-3">
        <Link href="/model">
          <Button variant="secondary" className="gap-2">
            Full model metrics <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/explainability">
          <Button variant="secondary" className="gap-2">
            Explainability <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/docs">
          <Button variant="secondary" className="gap-2">
            Documentation <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </FadeIn>
    </div>
  );
}

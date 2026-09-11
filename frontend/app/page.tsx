import Link from "next/link";
import { ShieldCheck, Brain, Scale, Cpu, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { HeroRiskVisual } from "@/components/dashboard/HeroRiskVisual";
import { FadeIn } from "@/components/effects/FadeIn";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Fraud Detection",
    description:
      "An imbalance-aware Random Forest classifier trained on a highly skewed, real-world-style transaction dataset (~0.17% fraud).",
  },
  {
    icon: Brain,
    title: "Explainable AI",
    description:
      "SHAP explanations show which anonymized model features pushed each prediction toward or away from fraud — never a causal claim.",
  },
  {
    icon: Scale,
    title: "Cost-Sensitive Decisions",
    description:
      "The decision threshold is chosen to minimize an illustrative business cost, not fixed arbitrarily at 0.5.",
  },
  {
    icon: Cpu,
    title: "Production Inference",
    description:
      "A FastAPI service loads the exact trained artifacts once at startup and never retrains — the same pipeline as the research notebook.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 animate-float-slow rounded-full bg-[radial-gradient(circle,rgba(155,123,246,0.16),transparent_70%)]" />

      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
        <FadeIn>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted backdrop-blur-sm">
            <Activity className="h-3 w-3 text-accent" aria-hidden /> Research / Portfolio Project
          </span>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            <span className="text-gradient-signal-animated">FraudShield</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.14}>
          <p className="mt-3 text-lg text-foreground/90 sm:text-xl">
            Explainable, Cost-Sensitive Fraud Detection
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 max-w-2xl text-balance text-sm text-muted sm:text-base">
            An ML-powered fraud detection system combining imbalance-aware machine learning,
            cost-sensitive threshold optimization, and explainable AI — built on the public Kaggle
            Credit Card Fraud dataset.
          </p>
        </FadeIn>

        <FadeIn delay={0.28}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/predict">
              <Button variant="primary" className="gap-2">
                Analyze Transaction <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/model">
              <Button variant="secondary">Explore Model</Button>
            </Link>
            <Link href="/research">
              <Button variant="secondary">Research &amp; Methodology</Button>
            </Link>
            <a href="https://github.com/AsjidSiddique/Fraudshield" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost">GitHub</Button>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.36} className="mt-16 w-full max-w-3xl">
          <HeroRiskVisual />
        </FadeIn>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={0.08 * i}>
              <Card className="glow-accent group relative h-full overflow-hidden">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(45,212,240,0.18),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardContent className="flex flex-col gap-3 pt-5">
                  <f.icon className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110" aria-hidden />
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted">{f.description}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Research question */}
      <section className="relative mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <FadeIn>
          <Card className="border-accent/30">
            <CardContent className="pt-6">
              <span className="text-xs font-medium uppercase tracking-wide text-accent">
                Research question
              </span>
              <p className="mt-2 text-base text-foreground sm:text-lg">
                How can a fraud detection system make useful decisions under extreme class
                imbalance while explicitly accounting for the different costs of false positives
                and false negatives?
              </p>
              <p className="mt-3 text-sm text-muted">
                Fraud is roughly 0.17% of transactions in this dataset — a model that always
                predicts &ldquo;legitimate&rdquo; would already be &gt;99.8% accurate while
                catching nothing. That&apos;s why this project evaluates with PR-AUC and a
                cost-weighted decision threshold instead of accuracy alone.{" "}
                <Link href="/research" className="link-underline text-accent">
                  Read the full methodology →
                </Link>
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Narrative flow */}
      <section className="relative mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <FadeIn>
          <h2 className="mb-4 text-center text-lg font-semibold text-foreground">The project, as a chain of questions</h2>
        </FadeIn>
        <FadeIn delay={0.06}>
          <div className="flex flex-col items-center">
            {[
              { q: "What problem are you solving?", a: "Extreme class imbalance", href: "/research" },
              { q: "How did you evaluate it?", a: "PR-AUC + Precision/Recall", href: "/analytics" },
              { q: "Which model did you use?", a: "Random Forest", href: "/model" },
              { q: "How do you make decisions?", a: "Cost-sensitive threshold = 0.44", href: "/research" },
              { q: "Can we understand it?", a: "SHAP", href: "/explainability" },
              { q: "Can we actually deploy it?", a: "FastAPI + Next.js", href: "/docs" },
              { q: "What are the limits?", a: "Temporal drift / calibration / monitoring", href: "/research" },
            ].map((step, i, arr) => (
              <div key={step.q} className="flex w-full max-w-sm flex-col items-center">
                <p className="text-center text-xs text-muted">{step.q}</p>
                <span className="my-1.5 text-muted-2" aria-hidden>↓</span>
                <Link href={step.href} className="w-full">
                  <div className="w-full rounded-lg border border-border bg-surface-2/50 px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5">
                    {step.a}
                  </div>
                </Link>
                {i < arr.length - 1 && <span className="my-1.5 text-muted-2" aria-hidden>↓</span>}
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Project at a glance */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <FadeIn>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Project at a glance</h2>
        </FadeIn>
        <FadeIn delay={0.06}>
          <Card>
            <CardContent className="grid gap-x-8 gap-y-4 pt-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Problem", "Extreme class imbalance in fraud detection"],
                ["Approach", "Imbalance-aware ML + cost-sensitive thresholding"],
                ["Model", "Random Forest, selected after comparing 4 candidates"],
                ["Explainability", "SHAP TreeExplainer"],
                ["Backend", "FastAPI"],
                ["Frontend", "Next.js / TypeScript"],
                ["Deployment", "Vercel frontend + Railway inference service"],
                ["Dataset", "284,807 transactions, ~0.17% fraud"],
                ["Limitations", "Historical, anonymized dataset — not banking-validated"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-2">{k}</dt>
                  <dd className="mt-1 text-foreground">{v}</dd>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  );
}

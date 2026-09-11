import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/effects/FadeIn";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Code2, ShieldHalf, MapPin, Mail, ArrowUpRight } from "lucide-react";

const DEVELOPER = {
  name: "Asjid Siddique",
  role: "Software Engineering Student building toward AI/ML Research",
  location: "Pakistan",
  linkedin: "https://www.linkedin.com/in/asjidsiddique469/",
  github: "https://github.com/AsjidSiddique",
  repo: "https://github.com/AsjidSiddique/Fraudshield",
  email: "asjadsaddique4@gmail.com",
};

const SELECTED_WORK = [
  {
    name: "FraudShield",
    description: "Explainable, cost-sensitive fraud detection (this project).",
    links: [
      { label: "Live demo", href: "https://fraudshield-sable.vercel.app" },
      { label: "GitHub", href: "https://github.com/AsjidSiddique/Fraudshield" },
    ],
  },
  {
    name: "Viro.pk",
    description:
      "A production e-commerce platform built and operated end-to-end — evidence of full-stack delivery beyond ML experimentation.",
    links: [{ label: "Live site", href: "https://www.viro.pk/" }],
  },
  {
    name: "OS Kernel Simulator",
    description: "Operating-system scheduling/memory algorithms with a full-stack simulation interface.",
    links: [{ label: "Live demo", href: "https://os-kernel-simulators.vercel.app/login" }],
  },
  {
    name: "AeroSys",
    description: "A Java airline management system delivered to a client.",
    links: [{ label: "GitHub", href: "https://github.com/AsjidSiddique/AeroSys-Airport-Management-System" }],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader title="About FraudShield" />

      <FadeIn>
        <Card>
          <CardContent className="space-y-4 pt-6 text-sm leading-relaxed text-muted">
            <p>
              FraudShield is a research/portfolio project demonstrating an end-to-end,
              explainable, cost-sensitive fraud detection pipeline built on the public Kaggle
              Credit Card Fraud Detection dataset (284,807 European cardholder transactions,
              September 2013).
            </p>
            <p>
              <strong className="text-foreground">This is not a real banking production system.</strong>{" "}
              It is a demonstration of imbalance-aware machine learning, cost-sensitive threshold
              optimization, and explainable AI, built to a production-style standard — a FastAPI
              inference service loading real trained artifacts, and a Next.js frontend that never
              fabricates results.
            </p>
            <p>
              The dataset&apos;s <code className="text-foreground">V1&ndash;V28</code> features are
              anonymized outputs of a PCA transformation performed by the original data owners for
              confidentiality; this project does not assign them invented real-world meaning
              anywhere in the notebook, backend, or UI.
            </p>
            <p>
              See <a href="/docs" className="link-underline text-accent">Documentation</a> for the
              API reference and the project README for setup and deployment instructions.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-6">
        <Card className="glow-accent relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float-slow rounded-full bg-[radial-gradient(circle,rgba(45,212,240,0.16),transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 animate-float-slow rounded-full bg-[radial-gradient(circle,rgba(155,123,246,0.14),transparent_70%)] [animation-delay:2s]" />

          <CardContent className="relative flex flex-col items-center gap-4 pt-10 pb-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2dd4f0,#9b7bf6)] shadow-[0_0_40px_-10px_rgba(45,212,240,0.5)]">
              <ShieldHalf className="h-8 w-8 text-background" aria-hidden />
            </span>

            <div>
              <h3 className="text-lg font-semibold text-foreground">{DEVELOPER.name}</h3>
              <p className="text-sm text-muted">{DEVELOPER.role}</p>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-2">
                <MapPin className="h-3 w-3" aria-hidden /> {DEVELOPER.location}
              </p>
            </div>

            <p className="max-w-md text-sm text-muted">
              Designed, trained, and shipped the full FraudShield pipeline — from the imbalance-aware
              model and cost-sensitive threshold search to the FastAPI inference service and this
              Next.js frontend.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={DEVELOPER.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="gap-2">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </Button>
              </a>
              <a href={DEVELOPER.github} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="gap-2">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </Button>
              </a>
              <a href={`mailto:${DEVELOPER.email}`}>
                <Button variant="secondary" className="gap-2">
                  <Mail className="h-4 w-4" aria-hidden /> Email
                </Button>
              </a>
              <a href={DEVELOPER.repo} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="gap-2">
                  <Code2 className="h-4 w-4" aria-hidden /> Project Source
                </Button>
              </a>
            </div>

            <p className="font-tabular text-xs text-muted-2">{DEVELOPER.email}</p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.14} className="mt-6">
        <Card>
          <CardContent className="space-y-5 pt-6 text-sm leading-relaxed text-muted">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-2">Background</h3>
              <p className="mt-2">
                I built FraudShield to explore the complete ML lifecycle — from data preparation
                and model evaluation to cost-sensitive decision making, explainability, API
                deployment, and reproducibility. I&apos;m interested in the intersection of
                software engineering, machine learning, explainable AI, and reliable AI systems.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-2">My technical direction</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-2 font-tabular text-xs">
                {["Software Engineering", "Algorithms + Systems", "Python + Machine Learning", "Explainable AI", "Reliable AI Systems", "AI/ML Research"].map((step, i, arr) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-border bg-surface-2/60 px-2.5 py-1 text-foreground">{step}</span>
                    {i < arr.length - 1 && <span className="text-muted-2" aria-hidden>&rarr;</span>}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-2">Education</h3>
              <p className="mt-2">
                BS Software Engineering, National University of Sciences &amp; Technology (NUST),
                Pakistan — CGPA 3.76/4.00. Relevant coursework: Algorithms (A), Operating Systems
                (A), Computer Networks (A), Probability &amp; Statistics (A), Discrete Mathematics (A).
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-2">Technical strengths</h3>
              <p className="mt-2">
                Python, C++, Java, JavaScript/TypeScript, React, Next.js, Node.js, Express, REST
                APIs, MongoDB, MySQL, Git/GitHub, Postman, and end-to-end deployment.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-2">Selected work</h3>
              <ul className="mt-2 space-y-3">
                {SELECTED_WORK.map((project) => (
                  <li key={project.name} className="rounded-lg border border-border bg-surface-2/40 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p>
                        <strong className="text-foreground">{project.name}</strong> — {project.description}
                      </p>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {project.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-underline inline-flex items-center gap-1 text-xs font-medium text-accent"
                          >
                            {l.label} <ArrowUpRight className="h-3 w-3" aria-hidden />
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted-2">
              I&apos;m a student developing toward ML research, not a published researcher — the
              positioning above is intentionally scoped to what I&apos;ve actually built.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

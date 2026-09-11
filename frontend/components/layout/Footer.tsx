"use client";

import { motion } from "framer-motion";
import { Code2, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

const DEVELOPER = {
  name: "Asjid Siddique",
  role: "BS Software Engineering · NUST",
  linkedin: "https://www.linkedin.com/in/asjidsiddique469/",
  github: "https://github.com/AsjidSiddique",
  repo: "https://github.com/AsjidSiddique/Fraudshield",
  email: "asjadsaddique4@gmail.com",
};

const SOCIAL_LINKS = [
  { href: DEVELOPER.github, label: "GitHub", icon: GithubIcon },
  { href: DEVELOPER.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: `mailto:${DEVELOPER.email}`, label: "Email", icon: Mail },
  { href: DEVELOPER.repo, label: "Source code", icon: Code2 },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(45,212,240,0.4),transparent)]" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 sm:px-6">
        <div className="flex w-full flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-foreground">FraudShield</p>
            <p className="text-xs text-muted">Research-oriented ML portfolio project</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 rounded-full border border-border bg-surface/70 px-4 py-2 text-xs text-muted backdrop-blur-sm"
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <a
                href={DEVELOPER.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-medium text-foreground"
              >
                {DEVELOPER.name}
              </a>
              <span className="hidden text-muted-2 sm:inline">· {DEVELOPER.role}</span>
            </span>

            <span className="h-3 w-px bg-border" aria-hidden />

            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  title={label}
                  className="text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-center text-xs text-muted-2">
          Public Kaggle Credit Card Fraud Detection dataset · Not a real banking production
          system.
        </p>
      </div>
    </footer>
  );
}

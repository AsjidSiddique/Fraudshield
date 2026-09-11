"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { BatchRowResult } from "@/lib/types";

export function ProbabilityHistogram({ results }: { results: BatchRowResult[] }) {
  const bucketCount = 10;
  const buckets = Array.from({ length: bucketCount }, (_, i) => ({
    range: `${i * 10}-${i * 10 + 10}%`,
    count: 0,
  }));

  results.forEach((r) => {
    const idx = Math.min(bucketCount - 1, Math.floor(r.fraud_probability * bucketCount));
    buckets[idx].count += 1;
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={buckets} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="range" tick={{ fontSize: 10, fill: "var(--muted)" }} interval={1} />
        <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Bar dataKey="count" fill="#2dd4f0" radius={[3, 3, 0, 0]} name="Rows" />
      </BarChart>
    </ResponsiveContainer>
  );
}

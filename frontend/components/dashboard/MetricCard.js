import { scoreTone } from "@/lib/format";

export default function MetricCard({ label, score = 0, detail }) {
  return (
    <article className="dashboard-card p-5 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <span className="font-display text-4xl font-semibold">{score ?? "--"}</span>
        <span className="text-sm text-slate-400">/100</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${scoreTone(score)}`} style={{ width: `${Math.max(score || 0, 8)}%` }} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{detail}</p>
    </article>
  );
}

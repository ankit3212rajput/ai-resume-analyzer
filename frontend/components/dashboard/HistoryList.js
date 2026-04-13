import { formatDate } from "@/lib/format";

export default function HistoryList({ history = [], onSelectResume }) {
  const recentResumeAnalyses = history.filter((item) => item.featureType === "resume");

  return (
    <div className="dashboard-card p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">History</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">Resume analysis history</h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
          {recentResumeAnalyses.length} saved
        </span>
      </div>
      <div className="mt-6 space-y-3">
        {recentResumeAnalyses.length ? (
          recentResumeAnalyses.map((entry) => (
            <button
              key={entry._id}
              type="button"
              onClick={() => onSelectResume?.(entry)}
              className="w-full rounded-[22px] border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-white">{entry.fileName || entry.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{entry.summary}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <span>Resume {entry.scores?.overall || "--"}</span>
                  <span>ATS {entry.scores?.ats || "--"}</span>
                  <span>{formatDate(entry.createdAt)}</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-white/15 bg-white/5 p-5 text-sm text-slate-300">
            No resume analyses yet. Upload a resume to generate your first scorecard.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPanel({ latestResumeAnalysis, latestJobMatch, latestRewrite, latestCoverLetter }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="dashboard-card p-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Improvement Suggestions</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">Latest AI recommendations</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Strengths</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {(latestResumeAnalysis?.strengths || []).slice(0, 4).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Suggestions</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {(latestResumeAnalysis?.improvementSuggestions || []).slice(0, 4).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
        {latestJobMatch ? (
          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Latest job match</p>
            <p className="mt-3 font-display text-3xl font-semibold text-white">{latestJobMatch.scores?.jobMatch || 0}/100</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {(latestJobMatch?.missingKeywords || []).slice(0, 5).map((item) => (
                <li key={item}>- Missing keyword: {item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="dashboard-card p-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Generated Content</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">Rewrites and cover letters</h3>
        <div className="mt-6 space-y-4">
          <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Latest bullet rewrite</p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{latestRewrite?.outputText || "Generate a rewrite from the dashboard tools to see it here."}</p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Latest cover letter</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-200">
              {latestCoverLetter?.outputText || "Generate a cover letter and the latest version will appear here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

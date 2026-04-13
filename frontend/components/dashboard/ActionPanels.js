import { useState } from "react";

export default function ActionPanels({ onJobMatch, onRewrite, onCoverLetter, selectedResumeId, loadingStates }) {
  const [jobDescription, setJobDescription] = useState("");
  const [bulletPoint, setBulletPoint] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="dashboard-card p-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Job Match</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">Compare with a job description</h3>
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={8}
          className="mt-5 w-full rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-slate-500"
          placeholder="Paste a target job description here..."
        />
        <button
          type="button"
          onClick={() => onJobMatch({ jobDescription, analysisId: selectedResumeId })}
          disabled={loadingStates.jobMatch || !jobDescription.trim()}
          className="mt-4 w-full rounded-full bg-tide px-5 py-3 text-sm font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingStates.jobMatch ? "Generating..." : "Generate Match Score"}
        </button>
      </div>

      <div className="dashboard-card p-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Rewrite AI</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">Upgrade a weak bullet point</h3>
        <textarea
          value={bulletPoint}
          onChange={(event) => setBulletPoint(event.target.value)}
          rows={8}
          className="mt-5 w-full rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-slate-500"
          placeholder='Example: "I worked on sales and marketing."'
        />
        <button
          type="button"
          onClick={() => onRewrite({ bulletPoint })}
          disabled={loadingStates.rewrite || !bulletPoint.trim()}
          className="mt-4 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-panel hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingStates.rewrite ? "Rewriting..." : "Rewrite Bullet"}
        </button>
      </div>

      <div className="dashboard-card p-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Cover Letter</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">Generate a tailored letter</h3>
        <div className="mt-5 grid gap-3">
          <input
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Job title"
          />
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Company name"
          />
        </div>
        <button
          type="button"
          onClick={() => onCoverLetter({ jobTitle, companyName, analysisId: selectedResumeId })}
          disabled={loadingStates.coverLetter || !jobTitle.trim() || !companyName.trim()}
          className="mt-4 w-full rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingStates.coverLetter ? "Writing..." : "Generate Cover Letter"}
        </button>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function HeroSection({ authenticated = false }) {
  return (
    <section className="section-grid pb-16 pt-10">
      <div className="glass-card grid gap-10 overflow-hidden bg-hero-radial px-6 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-14">
        <div>
          <span className="inline-flex rounded-full border border-tide/20 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-tide">
            Instant ATS Intelligence
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
            Upload your resume and get instant ATS &amp; AI feedback.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            AI Resume Analyzer Pro scores resume quality, checks ATS compatibility, surfaces missing skills, compares
            your resume to job descriptions, and generates sharper rewrites and cover letters.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href={authenticated ? "/dashboard" : "/auth/signup"}
              className="rounded-full bg-ink px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
            >
              Upload Resume
            </Link>
            <a
              href="#pricing"
              className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              View Pricing
            </a>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            ["ATS Score", "91", "Keyword coverage and heading structure are strong."],
            ["Resume Quality", "87", "Your impact bullets are clean, measurable, and recruiter-friendly."],
            ["Job Match", "78", "Add React, analytics, and stakeholder management keywords to improve fit."],
          ].map(([label, score, copy]) => (
            <div key={label} className="rounded-[24px] border border-white/60 bg-white/75 p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                <span className="font-display text-3xl font-semibold text-ink">{score}</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-tide to-emerald-400" style={{ width: `${score}%` }} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

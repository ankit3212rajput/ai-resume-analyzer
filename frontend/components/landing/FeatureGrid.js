const features = [
  {
    title: "AI Resume Analysis",
    copy: "Get an overall score, ATS compatibility score, strengths, weaknesses, missing skills, and improvement ideas.",
  },
  {
    title: "Job Match Intelligence",
    copy: "Paste a job description and see your match score, missing keywords, and the skills gap to close.",
  },
  {
    title: "Resume Rewrite AI",
    copy: "Rewrite weak bullets into sharper, outcome-driven statements recruiters notice immediately.",
  },
  {
    title: "Cover Letter Generator",
    copy: "Generate tailored cover letters using your resume context, job title, and target company.",
  },
  {
    title: "Dashboard Analytics",
    copy: "Track score history over time with clean charts for resume quality, ATS performance, and job fit.",
  },
  {
    title: "Admin Visibility",
    copy: "Review users, analysis logs, and subscription plans from a dedicated admin dashboard.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="section-grid py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-tide">Features</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-5xl">Everything needed for a resume-focused SaaS.</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <article key={feature.title} className="glass-card p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{feature.title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{feature.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

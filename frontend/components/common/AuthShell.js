import Link from "next/link";

export default function AuthShell({ title, subtitle, alternateHref, alternateLabel, children }) {
  return (
    <div className="min-h-screen bg-hero-radial">
      <div className="section-grid flex min-h-screen items-center justify-center py-12">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card hidden p-8 lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-tide">AI Resume Analyzer Pro</p>
            <h1 className="mt-5 font-display text-4xl font-semibold text-ink">Turn every application into a stronger fit.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Score your resume, improve ATS compatibility, tailor for job descriptions, and generate polished cover
              letters from one dashboard.
            </p>
            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <p>- Instant ATS and quality scoring</p>
              <p>- Resume rewrite AI and cover letters</p>
              <p>- Stripe billing and Google login ready</p>
            </div>
          </div>
          <div className="glass-card p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">Welcome</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{title}</h2>
                <p className="mt-3 text-slate-600">{subtitle}</p>
              </div>
              <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-ink">
                Home
              </Link>
            </div>
            <div className="mt-8">{children}</div>
            <p className="mt-6 text-sm text-slate-500">
              <Link href={alternateHref} className="font-semibold text-ink">
                {alternateLabel}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

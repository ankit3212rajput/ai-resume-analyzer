export default function Footer() {
  return (
    <footer className="section-grid py-10">
      <div className="glass-card flex flex-col gap-4 px-6 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-ink">AI Resume Analyzer Pro</p>
          <p>Smarter resume feedback, ATS scoring, rewrites, and cover letters in one workflow.</p>
        </div>
        <div className="flex gap-4">
          <a href="/sitemap.xml" className="hover:text-ink">
            Sitemap
          </a>
          <a href="/robots.txt" className="hover:text-ink">
            Robots
          </a>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Navbar({ authenticated = false }) {
  return (
    <header className="section-grid pt-6">
      <nav className="glass-card flex items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-lg font-semibold text-ink">
          AI Resume Analyzer Pro
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="hover:text-ink">
            Features
          </a>
          <a href="#pricing" className="hover:text-ink">
            Pricing
          </a>
          <a href="#testimonials" className="hover:text-ink">
            Testimonials
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={authenticated ? "/dashboard" : "/auth/login"}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            {authenticated ? "Dashboard" : "Login"}
          </Link>
          <Link
            href={authenticated ? "/dashboard" : "/auth/signup"}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {authenticated ? "Analyze Resume" : "Get Started"}
          </Link>
        </div>
      </nav>
    </header>
  );
}

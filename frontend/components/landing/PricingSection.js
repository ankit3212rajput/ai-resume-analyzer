const defaultPlans = [
  {
    key: "free",
    name: "Free",
    monthlyPrice: 0,
    resumeChecksPerMonth: 3,
    features: ["resumeAnalysis"],
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 3,
    resumeChecksPerMonth: null,
    features: ["resumeAnalysis", "resumeRewrite", "coverLetter"],
  },
  {
    key: "premium",
    name: "Premium",
    monthlyPrice: 5,
    resumeChecksPerMonth: null,
    features: ["resumeAnalysis", "resumeRewrite", "coverLetter", "jobMatch", "advancedFeedback", "keywordOptimization"],
  },
];

const featureLabels = {
  resumeAnalysis: "Resume analysis",
  resumeRewrite: "Resume rewrite AI",
  coverLetter: "Cover letter generator",
  jobMatch: "Job description match",
  advancedFeedback: "Advanced AI feedback",
  keywordOptimization: "Resume keyword optimization",
};

export default function PricingSection({ plans = defaultPlans, authenticated = false, onUpgrade }) {
  return (
    <section id="pricing" className="section-grid py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">Pricing</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-5xl">Simple pricing for candidates, coaches, and teams.</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const highlighted = plan.key === "premium";

          return (
            <div
              key={plan.key}
              className={`rounded-[28px] border p-7 shadow-soft ${
                highlighted ? "border-ink bg-ink text-white" : "border-white/70 bg-white/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`font-display text-2xl font-semibold ${highlighted ? "text-white" : "text-ink"}`}>
                  {plan.name}
                </h3>
                {highlighted ? (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                    Best value
                  </span>
                ) : null}
              </div>
              <p className={`mt-4 text-sm ${highlighted ? "text-slate-200" : "text-slate-600"}`}>
                {plan.resumeChecksPerMonth ? `${plan.resumeChecksPerMonth} checks per month` : "Unlimited resume checks"}
              </p>
              <div className="mt-5 flex items-end gap-2">
                <span className={`font-display text-5xl font-semibold ${highlighted ? "text-white" : "text-ink"}`}>
                  ${plan.monthlyPrice}
                </span>
                <span className={highlighted ? "pb-2 text-slate-300" : "pb-2 text-slate-500"}>/month</span>
              </div>
                <ul className={`mt-6 space-y-3 text-sm ${highlighted ? "text-slate-200" : "text-slate-600"}`}>
                  {plan.features.map((feature) => (
                  <li key={feature}>- {featureLabels[feature] || feature}</li>
                  ))}
                </ul>
              <button
                type="button"
                onClick={() => onUpgrade?.(plan.key)}
                className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold ${
                  highlighted ? "bg-white text-ink hover:bg-slate-100" : "bg-ink text-white hover:bg-slate-800"
                }`}
              >
                {authenticated ? `Choose ${plan.name}` : `Start ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

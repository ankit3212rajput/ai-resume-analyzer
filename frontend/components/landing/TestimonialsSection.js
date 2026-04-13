const testimonials = [
  {
    name: "Maya Patel",
    role: "Product Marketing Manager",
    quote: "The ATS feedback was more actionable than anything I got from generic resume checkers. I used the rewrite tool and started getting more recruiter replies the same week.",
  },
  {
    name: "Jordan Lee",
    role: "Full Stack Engineer",
    quote: "The job match score made it obvious which keywords were missing. It turned tailoring applications from a guessing game into a quick, repeatable workflow.",
  },
  {
    name: "Sophia Carter",
    role: "Career Coach",
    quote: "My clients love the instant scoring and cover letter generator. It feels like a polished SaaS product, not just another AI demo.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-grid py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-tide">Testimonials</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-5xl">Trusted by candidates who want sharper applications.</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className="glass-card p-6">
            <p className="text-lg leading-8 text-slate-700">"{testimonial.quote}"</p>
            <div className="mt-8 border-t border-slate-200 pt-4">
              <p className="font-display text-xl font-semibold text-ink">{testimonial.name}</p>
              <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

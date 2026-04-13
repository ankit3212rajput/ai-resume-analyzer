import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HeroSection from "@/components/landing/HeroSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Seo from "@/components/seo/Seo";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    apiRequest("/billing/plans")
      .then((response) => setPlans(response.plans))
      .catch(() => setPlans([]));
  }, []);

  function handleUpgrade(planKey) {
    if (isAuthenticated) {
      router.push(planKey === "free" ? "/dashboard" : `/dashboard?plan=${planKey}`);
      return;
    }

    router.push(`/auth/signup?plan=${planKey}`);
  }

  return (
    <>
      <Seo />
      <div className="min-h-screen bg-hero-radial">
        <Navbar authenticated={isAuthenticated} />
        <HeroSection authenticated={isAuthenticated} />
        <FeatureGrid />
        <PricingSection plans={plans.length ? plans : undefined} authenticated={isAuthenticated} onUpgrade={handleUpgrade} />
        <TestimonialsSection />
        <section className="section-grid py-12">
          <div className="glass-card flex flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center md:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-tide">Ready to improve your resume?</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Start analyzing your resume in minutes.</h2>
            </div>
            <button
              type="button"
              onClick={() => router.push(isAuthenticated ? "/dashboard" : "/auth/signup")}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {isAuthenticated ? "Open Dashboard" : "Create Free Account"}
            </button>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}

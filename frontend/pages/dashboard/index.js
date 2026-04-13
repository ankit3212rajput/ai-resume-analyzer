import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import AdSenseBlock from "@/components/common/AdSenseBlock";
import ActionPanels from "@/components/dashboard/ActionPanels";
import HistoryList from "@/components/dashboard/HistoryList";
import MetricCard from "@/components/dashboard/MetricCard";
import ResultsPanel from "@/components/dashboard/ResultsPanel";
import ResumeTemplates from "@/components/dashboard/ResumeTemplates";
import ScoreCharts from "@/components/dashboard/ScoreCharts";
import UploadPanel from "@/components/dashboard/UploadPanel";
import Seo from "@/components/seo/Seo";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { apiRequest } from "@/lib/api";
import { formatPlanName } from "@/lib/format";

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, refreshUser, logout, loading } = useProtectedRoute();
  const [history, setHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [autoCheckoutConsumed, setAutoCheckoutConsumed] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    upload: false,
    jobMatch: false,
    rewrite: false,
    coverLetter: false,
    checkout: false,
    portal: false,
  });

  const setBusy = useCallback((key, value) => {
    setLoadingStates((current) => ({ ...current, [key]: value }));
  }, []);

  const fetchHistory = useCallback(async () => {
    const response = await apiRequest("/analysis/history", { token });
    setHistory(response.history || []);
    const latestResume = (response.history || []).find((item) => item.featureType === "resume");
    setSelectedResumeId((current) => current || latestResume?._id || "");
  }, [token]);

  const handlePlanUpgrade = useCallback(
    async (plan) => {
      if (plan === "free") {
        toast("You are already on a free account.");
        return;
      }

      setBusy("checkout", true);
      try {
        const response = await apiRequest("/billing/checkout", {
          method: "POST",
          token,
          body: { plan },
        });
        window.location.href = response.checkoutUrl;
      } catch (error) {
        toast.error(error.message);
      } finally {
        setBusy("checkout", false);
      }
    },
    [setBusy, token]
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    Promise.all([
      fetchHistory(),
      apiRequest("/templates"),
      apiRequest("/billing/plans"),
      refreshUser(token),
    ])
      .then(([, templateResponse, planResponse]) => {
        setTemplates(templateResponse.templates || []);
        setPlans(planResponse.plans || []);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [fetchHistory, refreshUser, token]);

  useEffect(() => {
    const billingState = router.query.billing;
    if (billingState === "success") {
      toast.success("Subscription updated successfully.");
      refreshUser(token).catch(() => {});
    }
    if (billingState === "cancelled") {
      toast.error("Checkout was cancelled.");
    }
  }, [refreshUser, router.query.billing, token]);

  useEffect(() => {
    const requestedPlan = Array.isArray(router.query.plan) ? router.query.plan[0] : router.query.plan;

    if (!token || autoCheckoutConsumed || !["pro", "premium"].includes(requestedPlan)) {
      return;
    }

    setAutoCheckoutConsumed(true);
    handlePlanUpgrade(requestedPlan);
  }, [autoCheckoutConsumed, handlePlanUpgrade, router.query.plan, token]);

  const latestResumeAnalysis = useMemo(
    () => history.find((item) => item.featureType === "resume") || null,
    [history]
  );
  const latestJobMatch = useMemo(() => history.find((item) => item.featureType === "jobMatch") || null, [history]);
  const latestRewrite = useMemo(() => history.find((item) => item.featureType === "rewrite") || null, [history]);
  const latestCoverLetter = useMemo(
    () => history.find((item) => item.featureType === "coverLetter") || null,
    [history]
  );

  const latestScores = {
    overall: latestResumeAnalysis?.scores?.overall || 0,
    ats: latestResumeAnalysis?.scores?.ats || 0,
    jobMatch: latestJobMatch?.scores?.jobMatch || 0,
  };

  async function handleAnalyze(file) {
    const formData = new FormData();
    formData.append("resume", file);

    setBusy("upload", true);
    try {
      await apiRequest("/analysis/upload", {
        method: "POST",
        token,
        body: formData,
        isFormData: true,
      });
      await Promise.all([fetchHistory(), refreshUser(token)]);
      toast.success("Resume analyzed successfully.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy("upload", false);
    }
  }

  async function handleJobMatch(payload) {
    setBusy("jobMatch", true);
    try {
      const response = await apiRequest("/analysis/job-match", {
        method: "POST",
        token,
        body: payload,
      });
      await fetchHistory();
      toast.success(`Job match score: ${response.match.jobMatchScore}/100`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy("jobMatch", false);
    }
  }

  async function handleRewrite(payload) {
    setBusy("rewrite", true);
    try {
      await apiRequest("/analysis/rewrite", {
        method: "POST",
        token,
        body: payload,
      });
      await fetchHistory();
      toast.success("Bullet point rewritten.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy("rewrite", false);
    }
  }

  async function handleCoverLetter(payload) {
    setBusy("coverLetter", true);
    try {
      await apiRequest("/analysis/cover-letter", {
        method: "POST",
        token,
        body: payload,
      });
      await fetchHistory();
      toast.success("Cover letter generated.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy("coverLetter", false);
    }
  }

  async function handleBillingPortal() {
    setBusy("portal", true);
    try {
      const response = await apiRequest("/billing/portal", {
        method: "POST",
        token,
      });
      window.location.href = response.portalUrl;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy("portal", false);
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-dashboard-radial" />;
  }

  return (
    <>
      <Seo title="Dashboard | AI Resume Analyzer Pro" canonical="/dashboard" />
      <div className="min-h-screen bg-dashboard-radial text-white">
        <div className="section-grid py-6">
          <div className="dashboard-card flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-white">Welcome back, {user.name.split(" ")[0]}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {user.role === "admin" ? (
                <Link href="/admin" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white">
                  Admin Panel
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleBillingPortal}
                disabled={loadingStates.portal}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Billing Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-panel"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="section-grid pb-12">
          <div className="grid gap-5 lg:grid-cols-4">
            <MetricCard
              label="Resume Score"
              score={latestScores.overall}
              detail="Overall quality score based on clarity, impact, and recruiter readiness."
            />
            <MetricCard
              label="ATS Score"
              score={latestScores.ats}
              detail="Compatibility with applicant tracking systems and keyword structure."
            />
            <MetricCard
              label="Job Match Score"
              score={latestScores.jobMatch}
              detail="Alignment against the latest pasted job description and required keywords."
            />
            <article className="dashboard-card p-5 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Plan & usage</p>
              <h2 className="mt-4 font-display text-3xl font-semibold">{formatPlanName(user.plan)}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {user.usage?.limit
                  ? `${user.usage.remainingResumeChecks} of ${user.usage.limit} free resume checks remaining this month.`
                  : "Unlimited resume checks enabled."}
              </p>
              <button
                type="button"
                onClick={() => handlePlanUpgrade(user.plan === "free" ? "pro" : "premium")}
                disabled={loadingStates.checkout}
                className="mt-5 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {loadingStates.checkout ? "Opening Stripe..." : user.plan === "free" ? "Upgrade to Pro" : "Upgrade Plan"}
              </button>
            </article>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <UploadPanel onAnalyze={handleAnalyze} loading={loadingStates.upload} />
            <div className="dashboard-card p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Subscription Plans</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">Upgrade for more AI tools</h3>
              <div className="mt-6 grid gap-4">
                {plans.map((plan) => (
                  <div key={plan.key} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-xl font-semibold text-white">{plan.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          ${plan.monthlyPrice}/month - {plan.resumeChecksPerMonth || "Unlimited"} checks
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlanUpgrade(plan.key)}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-panel"
                      >
                        Choose
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {user.plan === "free" ? (
            <div className="mt-5">
              <AdSenseBlock />
            </div>
          ) : null}

          <div className="mt-5">
            <ScoreCharts history={history} latestScores={latestScores} />
          </div>

          <div className="mt-5">
            <ActionPanels
              selectedResumeId={selectedResumeId}
              onJobMatch={handleJobMatch}
              onRewrite={handleRewrite}
              onCoverLetter={handleCoverLetter}
              loadingStates={loadingStates}
            />
          </div>

          <div className="mt-5">
            <ResultsPanel
              latestResumeAnalysis={latestResumeAnalysis}
              latestJobMatch={latestJobMatch}
              latestRewrite={latestRewrite}
              latestCoverLetter={latestCoverLetter}
            />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <HistoryList history={history} onSelectResume={(entry) => setSelectedResumeId(entry._id)} />
            <ResumeTemplates templates={templates} />
          </div>
        </div>
      </div>
    </>
  );
}

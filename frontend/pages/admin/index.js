import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import Seo from "@/components/seo/Seo";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { apiRequest } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function AdminPage() {
  const { token, user, loading } = useProtectedRoute({ adminOnly: true });
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [plans, setPlans] = useState([]);

  const loadAdminData = useCallback(async () => {
    const [usersResponse, logsResponse, plansResponse] = await Promise.all([
      apiRequest("/admin/users", { token }),
      apiRequest("/admin/analyses", { token }),
      apiRequest("/admin/plans", { token }),
    ]);

    setUsers(usersResponse.users || []);
    setLogs(logsResponse.logs || []);
    setPlans(plansResponse.plans || []);
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    loadAdminData().catch((error) => toast.error(error.message));
  }, [loadAdminData, token]);

  async function updatePlan(userId, plan) {
    try {
      await apiRequest(`/admin/users/${userId}/plan`, {
        method: "PATCH",
        token,
        body: { plan, subscriptionStatus: plan === "free" ? "inactive" : "active" },
      });
      await loadAdminData();
      toast.success("User plan updated.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading || !user || user.role !== "admin") {
    return <div className="min-h-screen bg-dashboard-radial" />;
  }

  return (
    <>
      <Seo title="Admin Panel | AI Resume Analyzer Pro" canonical="/admin" />
      <div className="min-h-screen bg-dashboard-radial text-white">
        <div className="section-grid py-6">
          <div className="dashboard-card flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Admin Panel</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-white">Platform oversight</h1>
            </div>
            <Link href="/dashboard" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-panel">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="section-grid pb-12">
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.key} className="dashboard-card p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{plan.name}</p>
                <p className="mt-4 font-display text-4xl font-semibold text-white">${plan.monthlyPrice}</p>
                <p className="mt-3 text-sm text-slate-300">
                  {plan.resumeChecksPerMonth ? `${plan.resumeChecksPerMonth} checks/month` : "Unlimited usage"}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-5 dashboard-card overflow-hidden">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Users</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">Manage subscribers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Usage</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((entry) => (
                    <tr key={entry.id} className="border-t border-white/10">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{entry.name}</p>
                        <p className="text-slate-400">{entry.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p>{entry.plan}</p>
                        <p className="text-slate-400">{entry.subscriptionStatus}</p>
                      </td>
                      <td className="px-6 py-4">
                        {entry.usage.limit
                          ? `${entry.usage.usedResumeChecks}/${entry.usage.limit}`
                          : `${entry.usage.usedResumeChecks} used`}
                      </td>
                      <td className="px-6 py-4">{formatDate(entry.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {["free", "pro", "premium"].map((plan) => (
                            <button
                              key={plan}
                              type="button"
                              onClick={() => updatePlan(entry.id, plan)}
                              className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                            >
                              {plan}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 dashboard-card overflow-hidden">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Analysis Logs</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">Recent AI activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Summary</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((entry) => (
                    <tr key={entry._id} className="border-t border-white/10">
                      <td className="px-6 py-4">{entry.featureType}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{entry.user?.name || "Unknown"}</p>
                        <p className="text-slate-400">{entry.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{entry.summary}</td>
                      <td className="px-6 py-4">{entry.planAtExecution}</td>
                      <td className="px-6 py-4">{formatDate(entry.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

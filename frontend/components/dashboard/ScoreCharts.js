import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

import { formatDate } from "@/lib/format";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip);

export default function ScoreCharts({ history = [], latestScores = {} }) {
  const resumeHistory = history.filter((item) => item.featureType === "resume").slice(0, 6).reverse();
  const labels = resumeHistory.map((item) => formatDate(item.createdAt));

  const barData = {
    labels,
    datasets: [
      {
        label: "Resume Score",
        data: resumeHistory.map((item) => item.scores?.overall || 0),
        backgroundColor: "#14b8a6",
        borderRadius: 12,
      },
      {
        label: "ATS Score",
        data: resumeHistory.map((item) => item.scores?.ats || 0),
        backgroundColor: "#f97316",
        borderRadius: 12,
      },
    ],
  };

  const doughnutData = {
    labels: ["Resume Score", "ATS Score", "Job Match Score"],
    datasets: [
      {
        data: [latestScores.overall || 0, latestScores.ats || 0, latestScores.jobMatch || 0],
        backgroundColor: ["#14b8a6", "#f97316", "#3b82f6"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="dashboard-card p-6">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Resume trends</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-white">Score history</h3>
        </div>
        <div className="h-[280px]">
          <Bar
            data={barData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: "#cbd5e1",
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: "#94a3b8" },
                  grid: { display: false },
                },
                y: {
                  ticks: { color: "#94a3b8" },
                  grid: { color: "rgba(148, 163, 184, 0.15)" },
                },
              },
            }}
          />
        </div>
      </div>
      <div className="dashboard-card p-6">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Current breakdown</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-white">Score mix</h3>
        </div>
        <div className="mx-auto h-[280px] max-w-[280px]">
          <Doughnut
            data={doughnutData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: "#cbd5e1",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function formatDate(value) {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPlanName(plan) {
  if (!plan) {
    return "Free";
  }

  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function scoreTone(score = 0) {
  if (score >= 80) {
    return "bg-emerald-500";
  }

  if (score >= 60) {
    return "bg-amber-400";
  }

  return "bg-rose-500";
}

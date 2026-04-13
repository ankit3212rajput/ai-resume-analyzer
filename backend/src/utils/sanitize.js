function sanitizePlainText(value, maxLength = 4000) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\0/g, "")
    .replace(/[<>]/g, "")
    .replace(/[^\S\r\n]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeMultilineText(value, maxLength = 12000) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\0/g, "")
    .replace(/[<>]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function toCleanStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => sanitizePlainText(String(item || ""), 180))
    .filter(Boolean)
    .slice(0, 12);
}

function toScore(value, fallback = 0) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, Math.round(numeric)));
}

module.exports = {
  sanitizeMultilineText,
  sanitizePlainText,
  toCleanStringArray,
  toScore,
};

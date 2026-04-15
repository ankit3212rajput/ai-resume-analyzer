const DEFAULT_API_BASE_URL = "https://ai-resume-analyzer-fz8b.onrender.com/api";

function normalizeApiBaseUrl(value) {
  const normalized = String(value || DEFAULT_API_BASE_URL)
    .trim()
    .replace(/\/+$/, "");

  return normalized.replace(/\/auth$/, "");
}

function normalizeApiPath(path) {
  let normalized = String(path || "").trim();

  if (!normalized) {
    return "";
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  normalized = normalized.replace(/^\/api(?=\/|$)/, "");
  normalized = normalized.replace(/^\/auth\/auth(?=\/|$)/, "/auth");

  return normalized;
}

export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL);
export const TOKEN_STORAGE_KEY = "aira_token";
export const AUTH_API_PATHS = Object.freeze({
  me: "/auth/me",
  login: "/auth/login",
  register: "/auth/register",
  google: "/auth/google",
});

export function buildApiUrl(path) {
  return `${API_BASE_URL}${normalizeApiPath(path)}`;
}

export async function apiRequest(path, { method = "GET", token, body, isFormData = false } = {}) {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (_error) {
    throw new Error(
      `Unable to reach the backend API at ${API_BASE_URL}. Start the backend server or update NEXT_PUBLIC_API_URL.`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : { success: response.ok, message: await response.text() };

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export function getStoredToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY) || "";
}

export function setStoredToken(token) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

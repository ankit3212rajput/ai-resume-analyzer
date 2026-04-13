export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const TOKEN_STORAGE_KEY = "aira_token";

export async function apiRequest(path, { method = "GET", token, body, isFormData = false } = {}) {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

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

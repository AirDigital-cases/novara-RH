const STORAGE_KEY = "novare_rh_session";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
const API_PREFIX = "/api/v1";

export class ApiError extends Error {
  constructor(message, status, payload = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

function buildApiUrl(path, query = {}) {
  const url = new URL(`${API_BASE_URL}${API_PREFIX}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    url.searchParams.set(key, String(value));
  });

  return url;
}

function parseStoredSession() {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch (_error) {
    return null;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

async function request(path, { method = "GET", body, headers = {}, auth = true, query } = {}) {
  const token = getAccessToken();

  if (auth && !token) {
    throw new ApiError("Sessao nao encontrada. Faca login para continuar.", 401);
  }

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (auth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = body instanceof FormData;
  if (body && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(buildApiUrl(path, query), {
    method,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      payload?.error || payload?.message || `A requisicao falhou com status ${response.status}.`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export function getAuthSession() {
  return parseStoredSession();
}

export function getAccessToken() {
  return getAuthSession()?.accessToken || null;
}

export function hasAuthSession() {
  return Boolean(getAccessToken());
}

export function saveAuthSession(session) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export async function login(credentials) {
  const payload = await request("/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });

  saveAuthSession({
    accessToken: payload.access_token,
    user: payload.user,
  });

  return payload;
}

export function getDashboardOverview() {
  return request("/dashboard/overview");
}

export function getJobs(query, options = {}) {
  return request("/jobs", { query, auth: options.auth ?? true });
}

export function getPublicJobs(query) {
  return request("/jobs", { query, auth: false });
}

export function getJobById(jobId, options = {}) {
  return request(`/jobs/${jobId}`, { auth: options.auth ?? true });
}

export function getPublicJobById(jobId) {
  return request(`/jobs/${jobId}`, { auth: false });
}

export function createJob(payload) {
  return request("/jobs", {
    method: "POST",
    body: payload,
  });
}

export function getCompanies() {
  return request("/companies");
}

export function getCandidates(query) {
  return request("/candidates", { query });
}

export function getCandidateById(candidateId) {
  return request(`/candidates/${candidateId}`);
}

export function submitJobApplication(jobId, formData) {
  return request(`/jobs/${jobId}/apply`, {
    method: "POST",
    body: formData,
    auth: false,
  });
}

export function submitCandidateAnswers(candidateId, answers) {
  return request(`/candidates/${candidateId}/answers`, {
    method: "POST",
    body: { answers },
    auth: false,
  });
}

export function buildUploadUrl(filePath) {
  if (!filePath) {
    return null;
  }

  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  return new URL(filePath.replace(/^\//, ""), `${API_BASE_URL}/`).toString();
}

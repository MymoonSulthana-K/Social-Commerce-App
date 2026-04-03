import { API_BASE_URL } from "./config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      `Network error calling ${url}. Check backend URL, deployment status, and CORS.`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const responseBody = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      isJson && responseBody?.message
        ? responseBody.message
        : `Request failed (${response.status}) at ${url}`;
    throw new Error(message);
  }

  if (!isJson) {
    throw new Error(
      `Expected JSON but received "${contentType || "unknown"}" from ${url}. Check API base URL and Vercel routing.`
    );
  }

  return responseBody;
};

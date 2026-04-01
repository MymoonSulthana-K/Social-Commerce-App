const ADMIN_API_BASE_URL = "http://localhost:5000/api";

const getAdminHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const adminRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${ADMIN_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAdminHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Admin request failed" }));

    throw new Error(error.message || "Admin request failed");
  }

  return response.json();
};

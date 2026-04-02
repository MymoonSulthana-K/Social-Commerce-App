const sanitizeBaseUrl = (value) => (value || "").replace(/\/+$/, "");

export const API_BASE_URL = sanitizeBaseUrl(
  process.env.REACT_APP_API_BASE_URL || "/api"
);

const defaultAssetBase = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

export const ASSET_BASE_URL = sanitizeBaseUrl(
  process.env.REACT_APP_ASSET_BASE_URL || defaultAssetBase
);

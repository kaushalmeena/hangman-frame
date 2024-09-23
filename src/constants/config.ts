export const FRAME_BASE_URL =
  process.env["FRAME_BASE_URL"] || "http://localhost:3000";

export const HUBS_ENDPOINT =
  process.env["HUBS_ENDPOINT"] || "http://localhost:3010/hub";

export const HUBS_API_KEY = process.env["HUBS_API_KEY"] || "";

export const ENCRYPTION_KEY = (process.env["ENCRYPTION_KEY"] || "")
  .slice(0, 32)
  .padEnd(32, "0");

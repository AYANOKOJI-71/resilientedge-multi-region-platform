import type { ResilienceOverview } from "./types";

async function request(path: string, method = "GET"): Promise<ResilienceOverview> {
  const response = await fetch(path, { method });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<ResilienceOverview>;
}

export const getOverview = () => request("/api/overview");
export const runRegionalFailover = () => request("/api/drills/regional-failover", "POST");
export const restorePrimary = () => request("/api/drills/restore-primary", "POST");

export type RegionState = "healthy" | "degraded" | "promoted" | "recovering" | "standby";

export interface RegionSnapshot {
  id: string;
  name: string;
  role: "primary" | "secondary";
  state: RegionState;
  availabilityZoneCount: number;
  trafficWeight: number;
  apiP95Ms: number;
  errorRatePercent: number;
  databaseRole: "writer" | "reader";
  replicationLagSeconds: number;
  activePods: number;
}

export interface DrillEvent {
  id: string;
  at: string;
  phase: "detect" | "route" | "database" | "verify" | "recover";
  title: string;
  detail: string;
}

export interface ResilienceOverview {
  mode: "deterministic-local";
  status: "ready" | "failover-active" | "recovery-verified";
  activeRegion: string;
  availabilityObjective: string;
  recoveryTimeObjective: string;
  recoveryPointObjective: string;
  regions: RegionSnapshot[];
  events: DrillEvent[];
  drillId: string | null;
  guardrails: string[];
}

export type RegionId = "us-east-1" | "us-west-2";
export type RegionState = "healthy" | "degraded" | "promoted" | "recovering" | "standby";
export type DrillStatus = "ready" | "failover-active" | "recovery-verified";

export interface RegionSnapshot {
  id: RegionId;
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
  status: DrillStatus;
  activeRegion: RegionId;
  availabilityObjective: string;
  recoveryTimeObjective: string;
  recoveryPointObjective: string;
  regions: RegionSnapshot[];
  events: DrillEvent[];
  drillId: string | null;
  guardrails: string[];
}

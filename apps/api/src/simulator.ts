import type { DrillEvent, RegionId, RegionSnapshot, ResilienceOverview } from "./types.js";

const PRIMARY: RegionId = "us-east-1";
const SECONDARY: RegionId = "us-west-2";

function event(phase: DrillEvent["phase"], title: string, detail: string): DrillEvent {
  return { id: `${phase}-${crypto.randomUUID()}`, at: new Date().toISOString(), phase, title, detail };
}

function baselineRegions(): RegionSnapshot[] {
  return [
    { id: PRIMARY, name: "N. Virginia", role: "primary", state: "healthy", availabilityZoneCount: 3, trafficWeight: 100, apiP95Ms: 82, errorRatePercent: 0.04, databaseRole: "writer", replicationLagSeconds: 0, activePods: 6 },
    { id: SECONDARY, name: "Oregon", role: "secondary", state: "standby", availabilityZoneCount: 3, trafficWeight: 0, apiP95Ms: 96, errorRatePercent: 0.03, databaseRole: "reader", replicationLagSeconds: 2, activePods: 3 },
  ];
}

export class RegionalFailoverSimulator {
  private regions = baselineRegions();
  private events: DrillEvent[] = [event("verify", "Steady state verified", "Primary serves traffic; secondary is warm and replication is within the drill threshold.")];
  private status: ResilienceOverview["status"] = "ready";
  private activeRegion: RegionId = PRIMARY;
  private drillId: string | null = null;

  overview(): ResilienceOverview {
    return {
      mode: "deterministic-local", status: this.status, activeRegion: this.activeRegion,
      availabilityObjective: "99.95% monthly service availability (demonstration objective)",
      recoveryTimeObjective: "15 minutes (regional failover drill objective)",
      recoveryPointObjective: "60 seconds maximum replication lag (drill threshold)",
      regions: structuredClone(this.regions), events: structuredClone(this.events), drillId: this.drillId,
      guardrails: ["No AWS APIs are called in deterministic-local mode.", "The drill changes in-memory state only; no infrastructure, DNS, database, or Kubernetes workload is modified.", "Terraform values are placeholders and no cloud credentials are requested or stored."],
    };
  }

  runFailoverDrill(): ResilienceOverview {
    if (this.status === "failover-active") return this.overview();
    this.status = "failover-active";
    this.activeRegion = SECONDARY;
    this.drillId = `drill-${crypto.randomUUID().slice(0, 8)}`;
    this.regions = this.regions.map((region) => region.id === PRIMARY
      ? { ...region, state: "degraded", trafficWeight: 0, apiP95Ms: 1200, errorRatePercent: 18.6, databaseRole: "reader", activePods: 0 }
      : { ...region, state: "promoted", trafficWeight: 100, apiP95Ms: 118, errorRatePercent: 0.08, databaseRole: "writer", replicationLagSeconds: 0, activePods: 6 });
    this.events = [event("detect", "Regional health threshold breached", "Synthetic canary detects a primary-region availability and latency violation."), event("route", "Route 53 failover record selected", "The model shifts application traffic from us-east-1 to us-west-2."), event("database", "Secondary writer promoted", "The model completes an Aurora Global Database recovery decision with observed lag below 60 seconds."), event("verify", "Recovery evidence recorded", "Synthetic probes confirm healthy endpoint, writable data path, and minimum pod capacity in us-west-2."), ...this.events];
    return this.overview();
  }

  restorePrimary(): ResilienceOverview {
    if (this.status !== "failover-active") return this.overview();
    this.status = "recovery-verified";
    this.events = [event("recover", "Primary recovery recorded", "The original region is marked recovering; failback remains a controlled operator decision."), ...this.events];
    this.regions = this.regions.map((region) => region.id === PRIMARY ? { ...region, state: "recovering", apiP95Ms: 101, errorRatePercent: 0.07, activePods: 3 } : region);
    return this.overview();
  }
}

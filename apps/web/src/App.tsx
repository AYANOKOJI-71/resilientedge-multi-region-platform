import { useEffect, useState } from "react";
import { getOverview, restorePrimary, runRegionalFailover } from "./api";
import { compactTime, stateLabel } from "./format";
import type { ResilienceOverview } from "./types";

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="metric"><span>{label}</span><strong>{value}</strong></article>;
}

export default function App() {
  const [overview, setOverview] = useState<ResilienceOverview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.setTimeout(() => {
      getOverview().then(setOverview).catch((reason: unknown) => setError(String(reason)));
    }, 0);
  }, []);

  const act = async (operation: () => Promise<ResilienceOverview>) => {
    setBusy(true); setError(null);
    try { setOverview(await operation()); } catch (reason) { setError(reason instanceof Error ? reason.message : "The simulator request failed."); } finally { setBusy(false); }
  };

  if (!overview) return <main className="loading">Loading deterministic resilience model… {error}</main>;

  return (
    <main className="shell">
      <header className="masthead"><div><p className="eyebrow">AWS ACTIVE / PASSIVE REFERENCE LAB</p><h1>Resilient<span>Edge</span></h1><p className="subhead">Regional failover evidence workspace for infrastructure reviews and disaster-recovery drills.</p></div><div className="mode"><span className="dot" />{overview.mode} · no cloud calls</div></header>
      <section className="objective-grid" aria-label="Reliability objectives"><Metric label="Availability objective" value={overview.availabilityObjective} /><Metric label="Recovery time objective" value={overview.recoveryTimeObjective} /><Metric label="Recovery point objective" value={overview.recoveryPointObjective} /></section>
      <section className="command-bar"><div><span className={`state-badge ${overview.status}`}>{stateLabel(overview.status)}</span><strong>Active traffic region: {overview.activeRegion}</strong><p>{overview.drillId ? `Evidence set ${overview.drillId}` : "No drill is active. Steady-state evidence is loaded."}</p></div><div className="actions"><button disabled={busy || overview.status === "failover-active"} onClick={() => void act(runRegionalFailover)}>Run regional failover drill</button><button className="secondary" disabled={busy || overview.status !== "failover-active"} onClick={() => void act(restorePrimary)}>Record primary recovery</button></div></section>
      {error && <p className="error">{error}</p>}
      <section className="region-grid" aria-label="Regional topology">{overview.regions.map((region) => <article className={`region-card ${region.state}`} key={region.id}><div className="region-heading"><div><p>{region.role.toUpperCase()} REGION</p><h2>{region.id}</h2><span>{region.name} · {region.availabilityZoneCount} AZ topology</span></div><span className="state-badge">{stateLabel(region.state)}</span></div><div className="stat-grid"><span><b>{region.trafficWeight}%</b>traffic weight</span><span><b>{region.apiP95Ms} ms</b>API p95</span><span><b>{region.errorRatePercent}%</b>error rate</span><span><b>{region.activePods}</b>ready pods</span></div><div className="data-plane"><span>Aurora role <b>{region.databaseRole}</b></span><span>replication lag <b>{region.replicationLagSeconds}s</b></span></div></article>)}</section>
      <section className="evidence-layout"><article className="timeline"><div className="panel-heading"><div><p>DRILL EVIDENCE</p><h2>Regional recovery timeline</h2></div><span>{overview.events.length} recorded controls</span></div><ol>{overview.events.map((item) => <li key={item.id}><span className={`phase ${item.phase}`}>{item.phase}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div><time>{compactTime(item.at)}</time></li>)}</ol></article><aside className="guardrails"><p>CONTROL BOUNDARIES</p><h2>Safe review mode</h2>{overview.guardrails.map((guardrail) => <p className="guardrail" key={guardrail}>{guardrail}</p>)}<div className="reference">Terraform, Kubernetes, CloudWatch dashboard templates, and recovery runbooks are reviewed as code. This console only simulates their expected control flow.</div></aside></section>
    </main>
  );
}

# Disaster Recovery Runbook

## Preconditions

Confirm the incident scope and change authority. Record the primary regional alarm, DNS health-check state, application request outcome, database replication lag, and the identity of the incident commander. Do not run the deterministic simulator as a substitute for AWS recovery controls.

## Failover sequence

1. Declare the regional event and freeze unrelated infrastructure changes.
2. Confirm that the Route 53 health check has selected the configured secondary record, then use independently monitored synthetic probes to verify client impact.
3. Measure Aurora Global Database replication lag and select the documented recovery action suitable for the actual failure state.
4. Ensure the secondary EKS workload has the configured healthy capacity, readiness, and PDB status.
5. Verify the write path, the read path, background dependency health, and error-rate/latency objectives.
6. Retain the original primary as **recovering**. Treat failback as a separate, reviewed change with its own validation window.

## Drill evidence

Capture timestamps for detection, traffic routing, data recovery decision, workload readiness, and synthetic endpoint verification. Compare the result with the 15-minute RTO and 60-second RPO thresholds; record deviations and corrective actions.

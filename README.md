# ResilientEdge — Multi-Region Availability Lab

**ResilientEdge** is an interview-ready reference implementation for an AWS active/passive, multi-region web application. It combines a deterministic local resilience console with Terraform and Kubernetes code that models an operational architecture rather than making cloud changes by default.

> **Safety and cost boundary:** the dashboard is a local simulator. It makes no AWS API calls, creates no AWS resources, and uses no credentials. Terraform is intentionally validation-only until a reviewer supplies their own approved cloud environment, provider configuration, DNS zone, identities, and change-control process.

## What it demonstrates

| Area | Included design |
|---|---|
| Regional topology | Primary `us-east-1`; warm secondary `us-west-2`; three-AZ EKS patterns in both regions |
| Traffic management | Route 53 health-check-based primary/secondary DNS records with a short illustrative TTL |
| Application availability | EKS readiness/liveness probes, zone topology spread, PDB, HPA, and ALB-oriented monitoring |
| Data recovery | Aurora Global Database recovery decision model with promotion lag gate and separate failback governance |
| Observability | CloudWatch dashboard template, regional request/error/latency signals, recovery-event ledger |
| Operations | React resilience console that runs an evidence-generating, deterministic failover drill |

## Architecture

```text
Clients → Route 53 health check/failover → Regional ALB → EKS workload (3 AZs)
                                       │
                  us-east-1 writer Aurora Global Database → us-west-2 secondary member
                                       │
                    CloudWatch alarms, metrics, and recovery evidence
```

The **Terraform environments** are intentionally divided into `primary`, `secondary`, and `global`. The global layer is limited to DNS and global-database relationship configuration. This keeps blast-radius discussions explicit during an interview. Read [Architecture](docs/ARCHITECTURE.md) and the [Disaster Recovery Runbook](docs/DISASTER_RECOVERY.md) before treating any code as deployable.

## Local demonstration

Requirements: Node.js 22+ and `npx`.

```bash
npx --yes pnpm@10.6.3 install
npx --yes pnpm@10.6.3 --filter resilientedge-api dev
# in another terminal
npx --yes pnpm@10.6.3 --filter resilientedge-console dev
```

Open the local console and select **Run failover drill**. The scenario moves traffic to the secondary region, checks the modeled replication-lag gate, promotes its write capability in the simulation, then records recovery evidence. It does not alter cloud DNS, databases, or Kubernetes clusters.

## Validation

```bash
make lint
make test
make build
# Terraform validation is credential-free but downloads providers:
make tf-validate
```

The CI workflow validates TypeScript, simulator tests, the React build, Terraform formatting and validation, plus a client-side Kubernetes manifest dry run. It never runs `terraform apply`.

## Repository map

```text
apps/api/                 Deterministic failover simulator API
apps/web/                 React resilience operations console
terraform/modules/        Network, EKS, Route 53, Aurora Global, observability modules
terraform/envs/           Primary, secondary, and global Terraform entrypoints
k8s/                      Multi-AZ workload availability controls
monitoring/               CloudWatch dashboard template
docs/                     Architecture, AWS research sources, and DR runbook
```

## Interview walkthrough

Start with the visible reliability objectives: **99.95% availability**, **15-minute RTO**, and an illustrative **under-60-second RPO gate**. Explain why the design preserves a warm secondary, separates traffic routing from data-promotion authority, records failover evidence, and makes failback a distinct approved operation. Then show the local drill and trace each control to the Terraform and Kubernetes artifacts.

# ResilientEdge Architecture

The lab models an **active/passive AWS application**: us-east-1 is primary for writes and traffic, while us-west-2 retains warm compute capacity and a reader-side Aurora Global Database member. Route 53 health-check failover provides the DNS control plane; each regional EKS deployment uses three Availability Zones, topology spread constraints, three replicas, a PodDisruptionBudget, and an HPA.

> This is an architectural reference, not a claim that Terraform has been applied. The review console is deterministic and makes no AWS API calls.

| Objective | Demonstration target | Evidence source |
|---|---:|---|
| Availability | 99.95% monthly | ALB status/error outcomes and synthetic probes |
| RTO | 15 minutes | timestamped failover drill timeline |
| RPO | under 60 seconds | Aurora replication-lag gate before promotion |

The Terraform code separates **primary**, **secondary**, and **global** control planes. Production promotion needs an approved operator runbook: prove health failure, assess replication lag, promote/restore the appropriate Aurora member, validate write-path and endpoint health, and make failback a separately approved action. AWS distinguishes planned switchovers from unplanned failovers; any claimed production RPO must be based on actual measured lag and provider behavior, not this simulator.[1]

[1] [AWS Aurora Global Database recovery guidance](https://docs.aws.amazon.com/r53recovery/latest/dg/aurora-global-database-block.html)

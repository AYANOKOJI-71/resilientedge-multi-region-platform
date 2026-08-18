# AWS Reliability Design References

ResilientEdge is a **reviewable infrastructure design and deterministic local simulator**. It does not call AWS, request credentials, change DNS, promote databases, or alter Kubernetes workloads. The Terraform modules and runbooks intentionally model operator-reviewed cloud controls rather than a live deployment.

The active/passive design uses a single writer region with a warm secondary. AWS describes this pattern as a primary Region handling writes with read-only secondary Regions replicated by Aurora Global Database. It distinguishes a controlled switchover, whose synchronization target can give an RPO of zero, from unplanned cross-Region failover, whose data loss risk depends on replication lag.[1] [2]

The monitoring model dimensions signals by Region, Availability Zone, service route, and workload identity. AWS guidance emphasizes aligning metric dimensions to fault-isolation boundaries and capturing application outcomes such as latency, success, and error counts rather than depending solely on resource metrics.[3]

## References

[1] [AWS Developer Tools Blog — Active-passive multi-Region APIs with Aurora](https://aws.amazon.com/blogs/developer/10322-2/)

[2] [AWS — Aurora Global Database execution block](https://docs.aws.amazon.com/r53recovery/latest/dg/aurora-global-database-block.html)

[3] [AWS — Multi-AZ observability](https://docs.aws.amazon.com/whitepapers/latest/advanced-multi-az-resilience-patterns/multi-az-observability.html)

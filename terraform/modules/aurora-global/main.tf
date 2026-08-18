variable "global_cluster_id" { type = string }
variable "primary_cluster_arn" { type = string }

resource "aws_rds_global_cluster" "this" {
  global_cluster_identifier    = var.global_cluster_id
  source_db_cluster_identifier = var.primary_cluster_arn
  deletion_protection          = true
  lifecycle { prevent_destroy = true }
}

output "id" { value = aws_rds_global_cluster.this.id }

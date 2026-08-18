variable "global_cluster_id" { type = string }
variable "engine" {
  type    = string
  default = "aurora-postgresql"
}

resource "aws_rds_global_cluster" "this" {
  global_cluster_identifier = var.global_cluster_id
  engine                    = var.engine
  deletion_protection       = true
  lifecycle { prevent_destroy = true }
}

output "id" { value = aws_rds_global_cluster.this.id }

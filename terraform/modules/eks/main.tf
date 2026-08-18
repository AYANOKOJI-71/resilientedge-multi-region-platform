variable "cluster_name" { type = string }
variable "cluster_role_arn" { type = string }
variable "subnet_ids" { type = list(string) }

resource "aws_eks_cluster" "this" {
  name     = var.cluster_name
  role_arn = var.cluster_role_arn
  vpc_config { subnet_ids = var.subnet_ids }
  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

output "endpoint" { value = aws_eks_cluster.this.endpoint }

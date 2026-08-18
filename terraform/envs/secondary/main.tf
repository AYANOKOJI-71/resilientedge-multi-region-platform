terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
provider "aws" { region = "us-west-2" }
variable "eks_cluster_role_arn" { type = string }

module "network" {
  source = "../../modules/network"
  name   = "resilientedge-secondary"
  cidr   = "10.30.0.0/20"
  azs    = ["us-west-2a", "us-west-2b", "us-west-2c"]
}

module "eks" {
  source           = "../../modules/eks"
  cluster_name     = "resilientedge-secondary"
  cluster_role_arn = var.eks_cluster_role_arn
  subnet_ids       = module.network.private_subnet_ids
}

module "observability" {
  source         = "../../modules/observability"
  dashboard_name = "resilientedge-secondary"
  region         = "us-west-2"
}

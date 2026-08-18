terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
provider "aws" { region = "us-east-1" }
variable "eks_cluster_role_arn" { type = string }

module "network" {
  source = "../../modules/network"
  name   = "resilientedge-primary"
  cidr   = "10.20.0.0/20"
  azs    = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

module "eks" {
  source           = "../../modules/eks"
  cluster_name     = "resilientedge-primary"
  cluster_role_arn = var.eks_cluster_role_arn
  subnet_ids       = module.network.private_subnet_ids
}

module "observability" {
  source         = "../../modules/observability"
  dashboard_name = "resilientedge-primary"
  region         = "us-east-1"
}

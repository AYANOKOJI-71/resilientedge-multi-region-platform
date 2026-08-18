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
variable "hosted_zone_id" { type = string }
variable "primary_alb_dns_name" { type = string }
variable "secondary_alb_dns_name" { type = string }

module "dns" {
  source             = "../../modules/dns-failover"
  zone_id            = var.hosted_zone_id
  record_name        = "app.example.invalid"
  primary_dns_name   = var.primary_alb_dns_name
  secondary_dns_name = var.secondary_alb_dns_name
}

module "aurora_global" {
  source            = "../../modules/aurora-global"
  global_cluster_id = "resilientedge-global"
}

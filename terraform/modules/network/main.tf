variable "name" { type = string }
variable "cidr" { type = string }
variable "azs" { type = list(string) }

resource "aws_vpc" "this" {
  cidr_block           = var.cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = { Name = var.name, ResilienceBoundary = "regional" }
}

resource "aws_subnet" "private" {
  for_each          = toset(var.azs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(var.cidr, 4, index(var.azs, each.value))
  availability_zone = each.value
  tags              = { Name = "${var.name}-${each.value}-private" }
}

output "vpc_id" { value = aws_vpc.this.id }
output "private_subnet_ids" { value = [for subnet in aws_subnet.private : subnet.id] }

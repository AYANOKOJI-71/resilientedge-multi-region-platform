variable "zone_id" { type = string }
variable "record_name" { type = string }
variable "primary_dns_name" { type = string }
variable "secondary_dns_name" { type = string }

resource "aws_route53_health_check" "primary" {
  fqdn              = var.primary_dns_name
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30
}

resource "aws_route53_record" "primary" {
  zone_id         = var.zone_id
  name            = var.record_name
  type            = "CNAME"
  ttl             = 60
  records         = [var.primary_dns_name]
  set_identifier  = "primary"
  health_check_id = aws_route53_health_check.primary.id
  failover_routing_policy { type = "PRIMARY" }
}

resource "aws_route53_record" "secondary" {
  zone_id        = var.zone_id
  name           = var.record_name
  type           = "CNAME"
  ttl            = 60
  records        = [var.secondary_dns_name]
  set_identifier = "secondary"
  failover_routing_policy { type = "SECONDARY" }
}

variable "dashboard_name" { type = string }
variable "region" { type = string }

resource "aws_cloudwatch_dashboard" "regional" {
  dashboard_name = var.dashboard_name
  dashboard_body = jsonencode({ widgets = [{ type = "metric", properties = { view = "timeSeries", region = var.region, title = "Regional availability", metrics = [["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count"]] } }] })
}

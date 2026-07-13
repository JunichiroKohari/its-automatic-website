output "d1_database_id" {
  description = "D1 database ID bound to the Worker."
  value       = cloudflare_d1_database.engineer_chat.id
}

output "d1_database_name" {
  description = "D1 database name."
  value       = cloudflare_d1_database.engineer_chat.name
}

output "worker_name" {
  description = "Deployed Worker name."
  value       = cloudflare_worker.engineer_chat.name
}

output "worker_version_id" {
  description = "Active Worker version ID."
  value       = cloudflare_worker_version.engineer_chat.id
}

output "worker_custom_domain_hostnames" {
  description = "Custom domain hostnames routed to the Worker."
  value       = keys(cloudflare_workers_custom_domain.engineer_chat)
}

output "turnstile_sitekey" {
  description = "Turnstile sitekey to expose to the browser."
  value       = var.enable_turnstile ? cloudflare_turnstile_widget.engineer_chat[0].sitekey : null
}

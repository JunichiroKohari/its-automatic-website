variable "cloudflare_account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "worker_name" {
  description = "Cloudflare Worker service name."
  type        = string
  default     = "engineer-skill-chat-api"
}

variable "worker_compatibility_date" {
  description = "Cloudflare Workers compatibility date."
  type        = string
  default     = "2026-07-13"
}

variable "enable_workers_dev" {
  description = "Enable the workers.dev subdomain for the Worker."
  type        = bool
  default     = true
}

variable "enable_worker_observability" {
  description = "Enable Cloudflare Worker observability."
  type        = bool
  default     = true
}

variable "worker_custom_domains" {
  description = "Optional custom domains for the Worker. Keys are hostnames."
  type = map(object({
    zone_id   = optional(string)
    zone_name = optional(string)
  }))
  default = {}

  validation {
    condition = alltrue([
      for _, config in var.worker_custom_domains :
      config.zone_id != null || config.zone_name != null
    ])
    error_message = "Each worker_custom_domains entry must set zone_id or zone_name."
  }
}

variable "d1_database_name" {
  description = "D1 database name for chat sessions and rate limits."
  type        = string
  default     = "engineer_chat"
}

variable "d1_primary_location_hint" {
  description = "D1 primary location hint. Ignored when d1_jurisdiction is set."
  type        = string
  default     = "apac"

  validation {
    condition     = contains(["wnam", "enam", "weur", "eeur", "apac", "oc"], var.d1_primary_location_hint)
    error_message = "d1_primary_location_hint must be one of: wnam, enam, weur, eeur, apac, oc."
  }
}

variable "d1_jurisdiction" {
  description = "Optional D1 jurisdiction restriction."
  type        = string
  default     = null

  validation {
    condition     = var.d1_jurisdiction == null || contains(["eu", "fedramp"], var.d1_jurisdiction)
    error_message = "d1_jurisdiction must be null, eu, or fedramp."
  }
}

variable "enable_d1_read_replication" {
  description = "Enable D1 automatic read replication."
  type        = bool
  default     = false
}

variable "allowed_origins" {
  description = "Origins allowed to call the Worker API."
  type        = list(string)
  default = [
    "https://its-automatic.com",
    "https://www.its-automatic.com",
  ]
}

variable "openai_api_key" {
  description = "OpenAI API key stored as a Worker secret_text binding."
  type        = string
  sensitive   = true
}

variable "openai_model" {
  description = "OpenAI model used by the chat Worker."
  type        = string
  default     = "gpt-5-nano"
}

variable "openai_reasoning_effort" {
  description = "Reasoning effort sent to the OpenAI Responses API."
  type        = string
  default     = "minimal"
}

variable "rate_limit_salt" {
  description = "Salt used to hash client identifiers for rate limiting."
  type        = string
  sensitive   = true
}

variable "max_input_chars" {
  description = "Maximum user message length accepted by the Worker."
  type        = number
  default     = 600
}

variable "max_output_tokens" {
  description = "Maximum output tokens requested from the OpenAI API."
  type        = number
  default     = 500
}

variable "max_session_turns" {
  description = "Maximum turns allowed per chat session."
  type        = number
  default     = 10
}

variable "history_message_limit" {
  description = "Number of recent messages sent back to the model."
  type        = number
  default     = 8
}

variable "ip_minute_limit" {
  description = "Per-IP request limit per minute."
  type        = number
  default     = 3
}

variable "ip_daily_limit" {
  description = "Per-IP request limit per day."
  type        = number
  default     = 20
}

variable "session_daily_limit" {
  description = "Per-session request limit per day."
  type        = number
  default     = 10
}

variable "global_daily_limit" {
  description = "Global request limit per day."
  type        = number
  default     = 100
}

variable "enable_turnstile" {
  description = "Create a Turnstile widget and require Turnstile tokens in production."
  type        = bool
  default     = true
}

variable "turnstile_domains" {
  description = "Domains allowed to use the Turnstile widget."
  type        = list(string)
  default = [
    "its-automatic.com",
    "www.its-automatic.com",
  ]
}

locals {
  repo_root         = abspath("${path.module}/../..")
  worker_main_file  = "${local.repo_root}/workers/engineer-chat/worker.js"
  worker_context_file = "${local.repo_root}/workers/engineer-chat/context.js"
  d1_migration_file = "${local.repo_root}/workers/engineer-chat/migrations/0001_initial.sql"

  worker_vars = {
    ALLOWED_ORIGINS       = join(",", var.allowed_origins)
    OPENAI_MODEL          = var.openai_model
    OPENAI_REASONING_EFFORT = var.openai_reasoning_effort
    MAX_REQUEST_BODY_CHARS = tostring(var.max_request_body_chars)
    MAX_INPUT_CHARS       = tostring(var.max_input_chars)
    MAX_OUTPUT_TOKENS     = tostring(var.max_output_tokens)
    MAX_SESSION_TURNS     = tostring(var.max_session_turns)
    HISTORY_MESSAGE_LIMIT = tostring(var.history_message_limit)
    IP_MINUTE_LIMIT       = tostring(var.ip_minute_limit)
    IP_DAILY_LIMIT        = tostring(var.ip_daily_limit)
    SESSION_DAILY_LIMIT   = tostring(var.session_daily_limit)
    GLOBAL_DAILY_LIMIT    = tostring(var.global_daily_limit)
    REQUIRE_TURNSTILE     = tostring(var.enable_turnstile)
    ALLOW_LOCAL_MOCK      = "false"
  }

  worker_plain_text_bindings = [
    for name, text in local.worker_vars : {
      name = name
      type = "plain_text"
      text = text
    }
  ]

  worker_secret_bindings = [
    {
      name = "OPENAI_API_KEY"
      type = "secret_text"
      text = var.openai_api_key
    },
    {
      name = "RATE_LIMIT_SALT"
      type = "secret_text"
      text = var.rate_limit_salt
    },
  ]

  turnstile_secret_bindings = var.enable_turnstile ? [
    {
      name = "TURNSTILE_SECRET_KEY"
      type = "secret_text"
      text = cloudflare_turnstile_widget.engineer_chat[0].secret
    }
  ] : []
}

resource "cloudflare_d1_database" "engineer_chat" {
  account_id = var.cloudflare_account_id
  name       = var.d1_database_name

  jurisdiction          = var.d1_jurisdiction
  primary_location_hint = var.d1_jurisdiction == null ? var.d1_primary_location_hint : null
  read_replication = var.enable_d1_read_replication ? {
    mode = "auto"
  } : null

  lifecycle {
    prevent_destroy = true
  }
}

resource "terraform_data" "d1_schema" {
  triggers_replace = {
    database_id      = cloudflare_d1_database.engineer_chat.id
    migration_sha256 = filesha256(local.d1_migration_file)
  }

  provisioner "local-exec" {
    command     = "node tools/apply-d1-migration.mjs"
    working_dir = local.repo_root
    environment = {
      CLOUDFLARE_ACCOUNT_ID = var.cloudflare_account_id
      D1_DATABASE_ID        = cloudflare_d1_database.engineer_chat.id
      D1_MIGRATION_FILE     = local.d1_migration_file
    }
  }
}

resource "cloudflare_turnstile_widget" "engineer_chat" {
  count = var.enable_turnstile ? 1 : 0

  account_id = var.cloudflare_account_id
  name       = "${var.worker_name}-turnstile"
  domains    = var.turnstile_domains
  mode       = "invisible"
  region     = "world"
}

resource "cloudflare_worker" "engineer_chat" {
  account_id = var.cloudflare_account_id
  name       = var.worker_name

  observability = {
    enabled = var.enable_worker_observability
  }

  subdomain = {
    enabled          = var.enable_workers_dev
    previews_enabled = false
  }
}

resource "cloudflare_worker_version" "engineer_chat" {
  account_id         = var.cloudflare_account_id
  worker_id          = cloudflare_worker.engineer_chat.id
  compatibility_date = var.worker_compatibility_date
  main_module        = "worker.js"

  annotations = {
    workers_message = "Managed by Terraform"
  }

  modules = [
    {
      name         = "worker.js"
      content_type = "application/javascript+module"
      content_file = local.worker_main_file
    },
    {
      name         = "context.js"
      content_type = "application/javascript+module"
      content_file = local.worker_context_file
    },
  ]

  bindings = concat(
    [
      {
        name = "DB"
        type = "d1"
        id   = cloudflare_d1_database.engineer_chat.id
      }
    ],
    local.worker_plain_text_bindings,
    local.worker_secret_bindings,
    local.turnstile_secret_bindings,
  )

  depends_on = [terraform_data.d1_schema]
}

resource "cloudflare_workers_deployment" "engineer_chat" {
  account_id  = var.cloudflare_account_id
  script_name = cloudflare_worker.engineer_chat.name
  strategy    = "percentage"

  versions = [{
    percentage = 100
    version_id = cloudflare_worker_version.engineer_chat.id
  }]

  annotations = {
    workers_message = "Terraform deployment"
  }
}

resource "cloudflare_workers_custom_domain" "engineer_chat" {
  for_each = var.worker_custom_domains

  account_id = var.cloudflare_account_id
  hostname   = each.key
  service    = cloudflare_worker.engineer_chat.name
  zone_id    = each.value.zone_id
  zone_name  = each.value.zone_name

  depends_on = [cloudflare_workers_deployment.engineer_chat]
}

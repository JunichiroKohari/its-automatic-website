# Cloudflare Terraform

Cloudflare 上の AI チャット API を Terraform でデプロイします。

対象リソース:

- Cloudflare D1 database: `engineer_chat`
- Cloudflare Worker: `engineer-skill-chat-api`
- Worker version/deployment
- Turnstile widget
- 任意の Worker custom domain

## 前提

- Terraform `>= 1.5`
- Node.js `>= 20`
- Cloudflare API token

API token は少なくとも次の権限を持つものを使います。

- Account: Workers Scripts: Edit
- Account: D1: Edit
- Account: Turnstile Sites: Edit
- Zone: Workers Routes: Edit または Zone: DNS: Edit/custom domain に必要な権限

## 初回設定

```bash
cp infra/cloudflare/terraform.tfvars.example infra/cloudflare/terraform.tfvars
```

`terraform.tfvars` に `cloudflare_account_id`、`openai_api_key`、`rate_limit_salt` を設定します。`terraform.tfvars` と state には secret が入るため、Git にはコミットしません。

Cloudflare API token は環境変数で渡します。

```bash
export CLOUDFLARE_API_TOKEN="..."
```

## デプロイ

```bash
npm run tf:cloudflare:init
npm run tf:cloudflare:plan
npm run tf:cloudflare:apply
```

`terraform apply` の中で `workers/engineer-chat/migrations/0001_initial.sql` を D1 Query API に流します。migration SQL は `CREATE TABLE IF NOT EXISTS` ベースなので再実行可能です。

D1 database には `prevent_destroy` を設定しています。削除や再作成が必要な場合は、バックアップを取ってから明示的に設定を変えてください。

## フロント側の設定

Terraform の output から Worker の URL と Turnstile sitekey を静的サイト側に渡します。

- `turnstile_sitekey`: ブラウザに公開する sitekey
- `worker_custom_domain_hostnames`: custom domain を設定した場合の API hostname

custom domain を使わない場合は、Cloudflare dashboard 上の `workers.dev` URL を使います。フロント側では `window.ENGINEER_CHAT_API_ENDPOINT` に `https://.../chat`、Turnstile を使う場合は `window.ENGINEER_CHAT_TURNSTILE_SITE_KEY` に sitekey を設定してください。

## 参考

- Cloudflare Workers IaC: https://developers.cloudflare.com/workers/platform/infrastructure-as-code/
- Cloudflare Terraform provider: https://developers.cloudflare.com/terraform/
- Cloudflare D1 Query API: https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/

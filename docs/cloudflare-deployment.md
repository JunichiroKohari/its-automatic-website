# Cloudflare Deployment Runbook

この手順書は、Cloudflare を使う部分だけを Terraform でデプロイするためのものです。静的サイト本体のビルドや配信は既存の運用に従い、ここでは `engineer_skill_sheet` の AI チャット API に必要な Cloudflare リソースを扱います。

## 現在のデプロイ状態

2026-07-30 時点では、初回本番デプロイを Terraform ではなく Wrangler OAuth で実行しています。

- Worker: `engineer-skill-chat-api`
- URL: `https://engineer-skill-chat-api.junichiro-kohari.workers.dev`
- D1 database: `engineer_chat`
- D1 database ID: `88f12f8a-e497-4f55-b357-0d34e62f9979`
- Turnstile: 有効 (`REQUIRE_TURNSTILE=true`)
- Turnstile sitekey: `0x4AAAAAAEBoL2jrqIU5Tx59`

この状態から Terraform 管理へ移す場合は、既存の Worker / D1 / 必要に応じて Turnstile を Terraform state へ import してから `plan` / `apply` してください。import せずに Terraform を実行すると、同名または別 ID のリソース作成、設定差分、管理経路の競合が起きます。

## 管理対象

Terraform は `infra/cloudflare` 配下で次を管理します。

- D1 database: `engineer_chat`
- Worker: `engineer-skill-chat-api`
- Worker version / deployment
- Turnstile widget
- 任意の Worker custom domain
- D1 初期 schema の適用

Terraform 運用に統一する場合、本番 Worker は Terraform でデプロイします。その場合は `wrangler deploy` を同じ Worker に対して使わず、`wrangler` はローカル開発や調査用途に限定します。現在の Wrangler デプロイから移行する場合は、先に既存リソースを import してください。

## 前提

- Node.js `>= 20`
- Terraform `>= 1.5`
- Cloudflare API token
- OpenAI API key
- `RATE_LIMIT_SALT` 用の十分長いランダム文字列

Cloudflare API token には少なくとも次の権限を付けます。

- Account: Workers Scripts: Edit
- Account: D1: Edit
- Account: Turnstile Sites: Edit
- custom domain を使う場合は対象 Zone への必要権限

API token は Terraform provider と D1 migration スクリプトの両方で使います。

## Secret と state の扱い

`openai_api_key` と `rate_limit_salt` は必須の Worker secret binding として設定されます。Turnstile を有効化する場合は Turnstile secret も secret binding として設定されます。ただし Terraform state には secret 値が残る可能性があるため、`terraform.tfvars` と state は Git に入れません。

個人運用でも `infra/cloudflare/terraform.tfstate` の保管には注意してください。チーム運用や CI/CD へ移す場合は、Terraform Cloud、S3 互換 backend、Cloudflare R2 backend などの remote state を先に設定します。

## 初回セットアップ

依存関係を入れます。

```bash
npm ci
```

Terraform 変数ファイルを作ります。

```bash
cp infra/cloudflare/terraform.tfvars.example infra/cloudflare/terraform.tfvars
```

`infra/cloudflare/terraform.tfvars` に最低限次を設定します。

```hcl
cloudflare_account_id = "..."

openai_api_key  = "sk-..."
rate_limit_salt = "..."
max_request_body_chars = 8192

allowed_origins = [
  "https://its-automatic.com",
  "https://www.its-automatic.com",
]

turnstile_domains = [
  "its-automatic.com",
  "www.its-automatic.com",
]
```

`rate_limit_salt` は次のように生成できます。

```bash
openssl rand -base64 32
```

Worker の custom domain を使う場合だけ、次を追加します。

```hcl
worker_custom_domains = {
  "api.its-automatic.com" = {
    zone_name = "its-automatic.com"
  }
}
```

Cloudflare API token を環境変数へ設定します。

```bash
export CLOUDFLARE_API_TOKEN="..."
```

Terraform を初期化します。

```bash
npm run tf:cloudflare:init
```

## デプロイ前チェック

Worker のコード、D1 schema、Terraform 定義のいずれかを変えた場合は plan を確認します。

```bash
npm run tf:cloudflare:plan
```

plan では特に次を確認します。

- `cloudflare_d1_database.engineer_chat` が意図せず作り直されないこと
- `cloudflare_worker_version.engineer_chat` が更新対象になっていること
- Turnstile や custom domain の追加・削除が意図通りであること
- `terraform_data.d1_schema` が schema 変更時だけ再実行されること

D1 には `prevent_destroy` を設定しています。D1 の削除や再作成が必要な場合は、先にバックアップ方針を決めてから Terraform 設定を明示的に変更します。

## デプロイ

plan に問題がなければ apply します。

```bash
npm run tf:cloudflare:apply
```

`apply` 中に `tools/apply-d1-migration.mjs` が実行され、`workers/engineer-chat/migrations/0001_initial.sql` が D1 Query API に送られます。SQL は `CREATE TABLE IF NOT EXISTS` を使っているため、同じ schema の再適用は安全です。

完了後、output を確認します。

```bash
terraform -chdir=infra/cloudflare output
```

Turnstile を使う場合、`turnstile_sitekey` はブラウザへ公開する値です。`OPENAI_API_KEY`、`RATE_LIMIT_SALT`、Turnstile secret はブラウザへ出しません。

## フロント側への反映

Worker API endpoint と Turnstile sitekey を静的サイト側へ設定します。

custom domain を使う場合:

```js
window.ENGINEER_CHAT_API_ENDPOINT = 'https://api.its-automatic.com/chat';
window.ENGINEER_CHAT_TURNSTILE_SITE_KEY = 'terraform-output-turnstile-sitekey';
```

custom domain を使わない場合は Cloudflare dashboard で `workers.dev` の URL を確認し、`https://<worker-subdomain>.workers.dev/chat` を設定します。

このリポジトリでは、次のどちらかで設定できます。

- `window.ENGINEER_CHAT_API_ENDPOINT` / `window.ENGINEER_CHAT_TURNSTILE_SITE_KEY`
- `src/features/legacy-pug/businesses/engineer_skill_sheet.pug` の `data-chat-api-endpoint` / `data-turnstile-site-key`

静的サイト側を変更した場合は、通常のサイトビルドを実行します。

```bash
npm run build
```

## デプロイ後確認

Worker の health endpoint を確認します。

```bash
curl -sSf https://api.its-automatic.com/health
```

custom domain を使っていない場合は、Cloudflare dashboard で確認した `workers.dev` URL に置き換えます。

期待値:

```json
{"ok":true,"service":"engineer-chat"}
```

その後、本番サイトの `engineer_skill_sheet` を開き、右下の AI チャットから質問を送信します。Turnstile を有効にしている場合、`/chat` への単純な `curl` は token なしで 403 になるのが正常です。

D1 schema を直接確認したい場合は、Cloudflare dashboard の D1 画面か D1 Query API で `sqlite_master` を確認します。

## 更新手順

Worker 実装だけを変えた場合:

```bash
npm run tf:cloudflare:plan
npm run tf:cloudflare:apply
curl -sSf https://api.its-automatic.com/health
```

D1 schema を変えた場合:

1. `workers/engineer-chat/migrations/0001_initial.sql` を冪等な SQL として更新する
2. `npm run tf:cloudflare:plan` で `terraform_data.d1_schema` の再実行を確認する
3. `npm run tf:cloudflare:apply`
4. D1 の table/index を確認する

設定値を変えた場合:

1. `infra/cloudflare/terraform.tfvars` を更新する
2. `npm run tf:cloudflare:plan`
3. `npm run tf:cloudflare:apply`
4. `terraform -chdir=infra/cloudflare output` を確認する

## ロールバック

原則は Git で前の状態へ戻して再 apply します。

```bash
git revert <bad-commit>
npm run tf:cloudflare:plan
npm run tf:cloudflare:apply
```

緊急時だけ Cloudflare dashboard から直前の Worker version へ戻すことがあります。その場合は Terraform state と実際の Cloudflare 状態がずれるため、落ち着いたタイミングで Git/Terraform 側も同じ状態へ合わせます。

D1 schema は破壊的変更を避けます。削除系や型変更が必要な場合は、バックアップ、移行 SQL、戻し方を別途用意してから実行します。

## よくある失敗

`Invalid provider configuration` や認証エラー:
`CLOUDFLARE_API_TOKEN` が未設定、期限切れ、または権限不足です。token の対象 account/zone も確認します。

D1 migration が失敗する:
`CLOUDFLARE_API_TOKEN` に D1 Write 権限があるか確認します。`workers/engineer-chat/migrations/0001_initial.sql` が SQLite/D1 で実行可能な SQL になっているかも確認します。

CORS でブラウザから呼べない:
`allowed_origins` に本番サイトの origin が入っているか確認します。末尾 slash は入れません。

Turnstile で 403 になる:
`turnstile_domains` にサイトのドメインが入っているか、フロント側に `turnstile_sitekey` が設定されているか、Worker 側で `TURNSTILE_SECRET_KEY` が binding されているか確認します。

Worker deployment が競合する:
同じ Worker に対して `wrangler deploy` と Terraform を混在させないでください。本番は Terraform に統一します。

## 参考

- Cloudflare Workers IaC: https://developers.cloudflare.com/workers/platform/infrastructure-as-code/
- Cloudflare Terraform provider: https://developers.cloudflare.com/terraform/
- Cloudflare D1 Query API: https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/
- Cloudflare API token: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

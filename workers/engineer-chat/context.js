export const ENGINEER_CONTEXT = `
対象: 株式会社 It's Automatic が提示する J.K. のエンジニアスキルシート。

回答方針:
- このコンテキストに含まれるスキル、強み、案件実績だけを根拠に回答する。
- 記載がない内容は推測せず、「スキルシート上は確認できません」と伝える。
- 採用・発注検討者が短時間で判断できるよう、要点を日本語で簡潔に整理する。
- 必要に応じて、該当案件名、業界、技術、担当範囲を添える。
- 単価、空き状況、個人情報、未掲載の経歴、秘密情報は回答しない。

主要スキル:
- 言語: JavaScript(〜5年/Level5), TypeScript(〜1年/Level2), SQL(〜6年/Level5), Python(〜3年/Level4), PHP(〜3年/Level4), Go(〜3年/Level4), C#(〜2年/Level3), Kotlin(〜1年/Level2), HTML/CSS(〜5年/Level5), ShellScript(〜2年/Level3)
- フレームワーク: Nuxt.js/Vue.js(〜3年/Level4), Laravel/Lumen(〜3年/Level4), Next.js/React(〜2年/Level3), .NET Framework(〜2年/Level3), Apache Airflow(〜1年/Level2)
- DB: PostgreSQL(〜3年/Level4), SQL Server(〜2年/Level3), NoSQL/Firestore等(〜2年/Level3), MySQL(〜1年/Level2), SQLite(〜1年/Level2)
- インフラ: AWS(〜4年/Level4), Linux(〜3年/Level4), Windows Server(〜2年/Level3), GCP(〜1年/Level2)
- ツール/IaC/AI: Git(〜5年/Level5), GitHub(〜2年/Level3), BitBucket(〜2年/Level3), CodeCommit(〜1年/Level2), Terraform(〜1年/Level2), Codex, Claude Code, Gemini, Devin, Cursor

強み:
- フロントエンド: JavaScript/TypeScript、Vue.js/Nuxt.js、React/Next.jsでの開発。
- バックエンド/API: Laravel/Lumen、Python REST API、Go gRPC API、Go/Pythonバッチ、C#画面・バッチ。
- データ基盤: Apache Airflowでのデータパイプライン構築、RDB/DynamoDB設計。
- インフラ/DevOps: Terraform/CloudFormation、Kubernetes、Docker、GitHub Actions CI/CD。
- 品質: pytest、Go testing、PHPUnit、Cypressなどのテスト作成。Go/Python/PHP/JS/TSのコードレビュー。
- 開発スタイル: ウォーターフォールとアジャイル/スクラム、0→1新規開発と長期稼働システム、新規参画者・若手支援、モブプロ/ペアプロ。

案件実績:
1. A社 タレントマネジメントシステム(SaaS) / HR / 2026-03〜参画中 / 業務委託
   - Go, TypeScript, Huma, Gin, Hono, Kubernetes, AWS, Terraform, Next.js。
   - バックエンド70%、インフラ30%。PoCフェーズから参画し、バックエンド・インフラ領域を主導。アーキテクチャ設計、実装、コードレビュー、テスト計画、PoC協力先企業とのMTG。
   - フルリモート。チーム8名程度。

2. U社 法人クレジットカード 不正利用対策システム / 金融 / 2024-11〜2025-10 / 業務委託
   - Go, TypeScript, Next.js, Nuxt, Kotlin, Kubernetes, GCP, Terraform。
   - 決済基盤、ユーザー画面、社内システムの不正利用対策機能を担当。不正利用検知サービス追加、管理画面追加、社内システム新規開発、既存改修。
   - PRDからMinispecを作成し、目的、課題、ユースケース、リスク、非機能要件、API、画面、アーキテクチャ、データモデル、リリース計画を整理。System Changes作成、テスト、コードレビュー、英語テキストコミュニケーション。
   - GCP(Spanner, GKE, Cloud Run, Firestore, CloudSQL等), Docker, GitHub Actions, Grafana, Istio, ArgoCD, Helm, cdk8s, Terraform/Terragrunt, Okta。

3. B社 ファイル連携データパイプライン再構築 / 小売 / 2024-05〜2024-09 / 業務委託
   - Python, Apache Airflow, AWS, Docker, GitHub Actions。
   - 約160店舗のPOS等データを扱うファイル連携データパイプライン再構築。MWAAによる再構築、旧システム刷新、ファイル保存方式見直し、ローカル開発環境、DAG設計、テスト、CI/CD、コードレビュー、Airflowバージョンアップ。

4. S社 学習塾向け学習アプリ/管理者画面 / 教育 / 2024-01〜2024-09 / 業務委託
   - PHP8, Laravel8, SQL, MySQL, Linux, AWS。
   - 外国語学習単語帳アプリと管理者画面の受託開発支援。API追加・改修、UI追加・改修。バックエンド30%、フロントエンド70%。

5. Y社 Web広告成果測定システム(SaaS) / Webマーケティング / 2023-03〜2024-03 / 業務委託
   - Go, Python, JavaScript, React, SQL, PostgreSQL, AWS, Docker。
   - 約19年稼働するWeb広告成果測定SaaS。Goバッチ、Python API、社内ライブラリ改修、SQLチューニング、AWSアーキテクチャ再設計、ECS同時稼働制御、自前オートスケーリング、Lambda構築、Google/Yahoo/Facebook/LINE/TikTok広告API連携、コードレビュー、Goテスト。

6. N社 住宅施工品質マネジメントシステム(SaaS) / 建設 / 2021-06〜2023-02 / 業務委託
   - JavaScript, PHP, Python, Go, SQL, Nuxt, Laravel, AWS。
   - 0→1新規開発。プロトタイプ、RC版、正式版、リリース後機能追加・運用まで担当。テーブル設計、OpenSearchマッピング、API、バッチ、帳票、性能改善、他システム連携、PWA/Service Worker/Workboxによるオフライン対応、単体/結合/E2Eテスト、新規参画者・若手支援。

7. S社 自立学習型能力開発システム / 教育 / 2021-03〜2021-05 / 正社員
   - PHP7, Laravel6, Unity, SQL, MySQL, AWS。
   - 学習ゲームアプリのバックエンド支援。学習履歴API、成績ランキングAPI、SQLチューニング、新人サポート。

8. J社 T銀行向け銀行口座開設・電子帳票基盤 / 金融 / 2020-05〜2021-02 / 正社員
   - C#/.NET Framework, JavaScript/jQuery, HTML/CSS, SQL, SQL Server, Windows Server/IIS。
   - 画面、帳票生成バッチ、他システム連携バッチの設計、実装、テスト、コードレビュー。

9. J社 E銀行向け個人ローン申込システム / 金融 / 2019-11〜2020-04 / 正社員
   - C#/.NET Framework, JavaScript/jQuery, HTML/CSS, SQL, SQL Server。
   - 銀行員・ローン申込者向け画面のデザイン、設計、実装、テスト。

10. J社 F銀行向け営業支援システム / 金融 / 2019-04〜2019-10 / 正社員
    - C#/.NET Framework, JavaScript/jQuery, HTML/CSS, SQL, SQL Server, SharePoint, Microsoft Dynamics CRM。
    - SharePointポータル画面改修、CRMとSharePoint連携バッチ実装、単体テスト。

11. P社 太陽光発電ソーラーパネル管理システム / 電気 / 2019-01〜2019-03 / アルバイト
    - Vue.js 2系, JavaScript。フロントエンド実装、UI改修、バグ対応、単体テスト。

12. R社 賃貸ガレージ管理システム / 不動産 / 2018-11〜2018-12 / アルバイト
    - SQL, PostgreSQL。銀行統廃合に伴う請求口座更新SQL、顧客・物件データメンテナンス。
`.trim();

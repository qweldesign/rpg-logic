# RPG.LOGIC

本プロジェクトは、TypeScriptで複雑なRPG戦闘ロジックの設計・実装をやってみる、という実験的試みです。

皆さんはテーブルトークRPGを知っていますか。会話とダイス (サイコロ) を使って進めていくという、今のコンピュータRPGのシステムの原型です。  
僕はやったことは無いのですが、昔からテーブルトークRPGのルールブックを読むのは好きでした。  
中でも、GURPS (ガープス) という Steve Jackson 氏によって創作されたこのゲームは、もう流行ったのは30年以上前ですが、かなりハチャメチャで、戦略性に富み、ルールも複雑なものでした。

今回は、このGURPSのルールを僕なりに簡略化し、戦闘ロジックを実装してみたいと思います。

- デモ版: [RPG.LOGIC デモ版](https://rpg-logic.dev/demo/)
- 完全版: [RPG.LOGIC 完全版](https://rpg-logic.dev)

---

## 1. 技術スタック

| 領域 | 技術 | 用途 |
|---|---|---|
| 言語 | TypeScript | 型安全な開発 |
| フレームワーク | React 19 | UI・画面構築 |
| ビルドツール | Vite | 開発環境・ビルド |
| スタイリング | Tailwind CSS v4 | UIスタイリング |
| スタイリング | Sass | 一部コンポーネントのスタイリング |
| ルーティング | react-router-dom | ページ・画面遷移 |
| Markdown | marked | Markdownのパース・ドキュメント表示 |

---

## 2. ディレクトリ構成

コードは主に **ドメイン層** と **UI層** の2層で構成され, それ以外にドキュメント (ルール) のMarkdownレンダリング・章立てを管理する独立ディレクトリが1つ存在する.

```text
src/
├── App.tsx / router.tsx / index.tsx   # エントリーポイント
│
├── docs/              # ドキュメント機能
│   ├── chapters.ts
│   ├── docsLoader.ts
│   └── markdown.ts
│
├── domains/           # ドメイン層：ゲームのルール・ロジック
│   ├── Character/
│   │   ├── index.ts         # キャラクタ管理
│   │   ├── Parameters.ts    # パラメータ管理
│   │   └── Equipments.ts    # 装備管理
│   │
│   ├── Sample/
│   │   └── index.ts         # サンプル・キャラクタ生成
│   │
│   ├── SaveData/
│   │   └── index.ts         # セーブデータ管理
│   │
│   └── Combat/
│       ├── index.ts         # 全ての戦闘状態を管理
│       ├── Log.tsx          # ログを管理
│       │
│       ├── Action/
│       │   ├── index.ts           # 行動を管理
│       │   ├── type.ts            # 行動に関する型定義
│       │   ├── Availability.ts    # 行動可否判定を管理
│       │   ├── Effects.ts         # 行動実行 (状態変更) を管理
│       │   └── roll.ts            # ダイスによる判定
│       │
│       ├── Formation/
│       │   ├── index.ts           # 戦闘配置を管理
│       │   ├── player.ts          # PC側の編成を管理
│       │   └── enemy.ts           # NPC側の編成を管理
│       │
│       └── Unit/
│           ├── index.ts           # 戦闘ユニットを管理
│           └── Health.ts          # 負傷状態を管理
│
└── parts/             # UI層：Reactによる画面・コンポーネント
    ├── index.tsx            # 初期画面 (タイトル/ナビゲーション)
    │
    ├── Docs/
    │   └── index.tsx        # ドキュメント画面
    │
    ├── List/
    │   ├── index.tsx        # キャラクタ一覧
    │   └── Detail.tsx       # キャラクタ詳細
    │
    ├── Sample/
    │   └── index.tsx        # サンプル・キャラクタ閲覧
    │
    ├── Setup/
    │   ├── index.tsx        # 編成画面
    │   ├── Confirm.tsx      # キャラクタ作成・編集確認画面
    │   ├── Formation.tsx    # 出撃メンバ選択画面
    │   ├── Modal.tsx        # モーダルウィンドウ
    │   │
    │   └── Edit/
    │       ├── index.tsx                # キャラクタ作成・編集画面
    │       ├── ParametersSetting.tsx    # パラメータ編集
    │       ├── EquipmentsSetting.tsx    # 装備編集
    │       └── ProfileSetting.tsx       # プロフィール編集
    │
    └── Combat/
        ├── index.tsx        # 戦闘画面
        ├── Action.tsx       # 行動入力
        ├── Formation.tsx    # 戦闘配置
        ├── Summary.tsx      # 戦闘情報
        └── Timeline.tsx     # ログ出力

```

---

## 3. 開発履歴

### v0.1.0 キャラクタの実装

- [x] パラメータ (能力値・技能値) の管理を司るクラスを実装
- [x] 編成画面UIの初期構成
- [x] 装備の管理を司るクラスを実装
- [x] 編成画面に装備の表示を追加
- [x] キャラクタの管理を司るクラスを実装
- [x] サンプル・キャラクタ生成を実装
- [x] 編成画面にCP選択機能を追加
- [x] 編成画面にソート機能を追加

### v0.2.0 編成画面の作成

- [x] キャラクタ管理にModel用データへの変換メソッドを追加
- [x] セーブデータ管理を司るクラスを実装
- [x] 編成画面の基盤を構築
- [x] キャラクタ作成画面を構築
  - [x] パラメータ割り振り画面
  - [x] 装備選択画面
  - [x] プロフィール設定画面
  - [x] 確認画面
- [x] モーダルウィンドウを実装
- [x] キャラクタ作成画面の各種アラートの表示
- [x] 両手武器装着時の盾解除を適用
- [x] 必要筋力による装備制限を適用
- [x] 所持金の管理を実装 (装備の売却を追加)
- [x] 名前の自動決定を実装
- [x] セーブデータのリセットと除名を実装
- [x] 出撃メンバの選択を実装
- [x] 初期メンバ生成時にシード値を保存

### v0.3.0 ターンとログの実装

- [x] 戦闘ユニットの管理を司るクラスを準備
- [x] 戦闘画面の基盤を構築
- [x] 戦闘配置を司るクラスとコンポーネントを実装
- [x] 戦闘情報の表示を司るコンポーネントを実装
- [x] ターンとログを実装
  - [x] 行動の管理を司るクラスを実装
  - [x] 行動可否判定を司るクラスを実装
  - [x] 行動実行 (状態変更) を司るクラスを実装
  - [x] 行動入力を司るコンポーネントを実装
  - [x] ターンの実装
  - [x] ログの実装
- [x] 戦闘情報に行動履歴を表示

---

## ライセンス | License

MIT License

詳しくは LICENSE ファイルをご覧ください。  
See the LICENSE file for details.  

※ GURPS (Generic Universal RolePlaying System) はSteve Jackson氏によって創作され、Steve Jackson Games社から出版されているTRPGです。本プロジェクトはGURPSを題材とした独立した非商用のファンプロジェクトであり、Steve Jackson Games社とは関係ありません。GURPSおよび関連する原著作物の権利は、それぞれの権利者に帰属します。  

---

## 制作者 | Author

[QWEL.DESIGN](https://qwel.design)  
福井を拠点に活動するフロントエンド開発者  
Front-end developer based in Fukui, Japan  

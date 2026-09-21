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
│   ├── Character
│   │   ├── index.ts         # キャラクタ管理
│   │   ├── Parameters.ts    # パラメータ管理
│   │   └── Equipments.ts    # 装備管理
│   │
│   └── Combat
│       ├── index.ts         # 戦闘状態を管理
│       │
│       └── Action
│           └── roll.ts      # ダイスによる判定
│
└── parts/             # UI層：Reactによる画面・コンポーネント
    ├── index.tsx            # 初期画面 (タイトル/ナビゲーション)
    │
    ├── Docs
    │   └── index.tsx        # ドキュメント画面
    │
    ├── List
    │   ├── index.tsx        # キャラクタ一覧
    │   └── Detail.tsx       # キャラクタ詳細
    │
    └── Setup
        └── index.tsx        # 編成画面

```

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

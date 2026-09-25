// src/domains/Combat/AI/index.ts

// 自動行動タイプの分類
const TACTIC_TYPE_KEYS = [
  'defender', // 防御型 (重戦士)
  'attacker', // 攻撃型 (軽戦士)
  'supporter', // 支援型 (魔術師)
  'balanced' // 万能型 (魔戦士)
] as const

export type TacticTypeKey = typeof TACTIC_TYPE_KEYS[number]

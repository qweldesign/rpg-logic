// src/domains/Combat/AI/attacker.ts

import { type TacticHandler } from '.'
import { base } from './base'

/**
 * Attacker (攻撃型)
 * 左翼・右翼に移動して, 前衛で戦う
 * 
 * 基本型の行動パターンを参照
 * 
 */
export const attacker: TacticHandler = (actor, state, temperType) => base(actor, state, temperType, 'wing')

// src/domains/Combat/AI/defender.ts

import { type TacticHandler } from '.'
import { base } from './base'

/**
 * Defender (防御型)
 * 積極的に中央に移動して, 前衛で戦う
 * 
 * 基本型の行動パターンを参照
 * 
 */
export const defender: TacticHandler = (actor, state) => base(actor, state, 'center')

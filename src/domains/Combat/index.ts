// src/domains/Combat/index.ts

import { type CombatUnitModel as UnitModel, CombatUnit as Unit } from './Unit'
import { CombatFormation as Formation } from './Formation'
import { CombatAction as Action } from './Action'

// 全ての情報を集約・管理するクラス
export class Combat {
  public round: number // 経過時間
  public turnIndex: number // 行動順
  public units: Unit[]
  public formation: Formation | null
  public action: Action | null
  public playLog: () => Promise<void> // Combat 本体から受け取り, ActionStore から呼び出す

  constructor(models: UnitModel[], playLog: () => Promise<void>) {
    this.round = 1 // 1からカウント
    this.turnIndex = 0 // 開幕前は 0, 開幕と同時に 1 になる
    this.units = models.map((model, i) => {
      return new Unit(model, i + 1) // combatIdは1からカウント
    })
    this.formation = null
    this.action = null
    this.playLog = playLog
  }

  get actor() {
    return this.units[this.turnIndex - 1]
  }

  // 次のターンへ進む
  async nextTurn() {
    this.advanceTurn()
    await this.startTurn()
  }

  // turnIndex / round を進める
  private advanceTurn(): void {
    this.turnIndex++
    if (this.turnIndex > this.units.length) {
      this.round++
      this.turnIndex -= this.units.length
    }
  }

  // 新しいターンの開始処理
  // formation, action 初期化
  private async startTurn(): Promise<void> {
    this.formation = new Formation(this.actor, this.units)
    this.action = new Action(this)
  }

  debug() {
    const { round, turnIndex, units } = this
    console.log({ round, turnIndex, units })
  }
}

// src/domains/Sample/index.ts

import { type Point, type ParameterKey, type CharacterModel, Character, type WeaponKey } from '../Character'
import { type CombatUnitModel } from '../Combat/Unit'
import { type TacticTypeKey } from '../Combat/AI'

/**
 * サンプル・キャラクタ生成アルゴリズム
 * 
 * 1. シード値 0～63 を生成
 * 
 * 2. 重戦士・軽戦士・魔術師・魔戦士に分岐
 *   最大能力値を, ST (筋力), DX (敏捷力), IN (知力) のうちで決定し, 3-1. へ進むか,
 *   最大能力値を決定せずに 3-2. へ進む
 * 
 * 3-1. 残りの能力値を以下のパターンで割り振る
 *   a. [0.5, 0.5, 1] (6)
 *   b. [0.5, 1, 0.5] (6)
 *   c. [1, 0.5, 0.5] (6)
 *   d. [0, 1, 1] (6)
 *   e. [1, 0, 1] (6)
 *   f. [1, 1, 0] (6)
 *   g. [0, 2, 1] (7)
 *   h. [2, 0, 1] (7)
 * 
 * 3-2. 魔戦士タイプの割り振りパターン (固定)
 *   a. [2, 0.5, 4, 0.5] (7)
 *   b. [2, 0, 4, 1] (7)
 *   c. [4, 0.5, 2, 0.5] (7)
 *   d. [4, 0, 2, 1] (7)
 *   e. [2, 0.5, 4, 0.5] (7)
 *   f. [2, 1, 4, 0] (7)
 *   g. [4, 0.5, 2, 0.5] (7)
 *   h. [4, 1, 2, 0] (7)
 * 
 * 4-1. HT (生命力) を +1 する/しない (男性イメージ)
 * 
 * 4-2. 4-1. をしなかった場合, 可能なら DX (敏捷力) を +1 する (女性イメージ)
 * 
 */

const DEFAULT_SIZE = 64 // シード値の範囲

const TABLE_1: Point[][] = [
  [0.5, 0.5, 1],
  [0.5, 1, 0.5],
  [1, 0.5, 0.5],
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0],
  [0, 2, 1],
  [2, 0, 1]
]

const TABLE_2: Point[][] = [
  [2, 0.5, 4, 0.5],
  [2, 0, 4, 1],
  [4, 0.5, 2, 0.5],
  [4, 0, 2, 1],
  [2, 0.5, 4, 0.5],
  [2, 1, 4, 0],
  [4, 0.5, 2, 0.5],
  [4, 1, 2, 0]
]

const SKILL_TABLE: ParameterKey[][] = [
  ['怪力', '格闘', '運動', '鍛錬', '修養', '礼法', '探索', '尋問', '歌唱'],
  ['運動', '探索', '細工', '鍛錬', '早業', '隠密', '軽業', '柔術', '演奏'],
  ['修養', '礼法', '交渉', '鍛錬', '尋問', '演技', '鑑定', '治癒', '歴史'],
  ['怪力', '格闘', '運動', '鍛錬', '修養', '礼法', '探索', '演技', '舞踏']
]

function makeAbilityValues(p: number, c: number): Point[] {
  let result: Point[] = [0, 0, 0, 0]

  // 最大能力値を, ST (筋力), DX (敏捷力), IN (知力) のうちで決定する
  if (p < 3) {
    result[p] = 4
    
    // 残りの能力値を割り振る
    const table = TABLE_1[c]
    if (p === 0) {
      result[1] = table[0]
      result[2] = table[1]
      result[3] = table[2]
    } else if (p === 1) {
      result[0] = table[0]
      result[2] = table[1]
      result[3] = table[2]
    } else {
      result[0] = table[0]
      result[1] = table[1]
      result[3] = table[2]
    }
  } else {
    // 魔戦士タイプの割り振りパターン (固定)
    result = TABLE_2[c].slice()
  }

  return result
}

// 名前 (PC用)
export const PC_LIST: string[] = [
  'アントニオ', 'ウィリアム', 'カイル', 'カーター', 'クリストファー', 'ザビエル',
  'ジェームス', 'ジェイコブ', 'ジョシュア', 'セス', 'タイラー',
  'チャールズ', 'ディラン', 'トリスタン', 'ナサニエル', 'ノア', 'ビクター',
  'ヘンリー', 'ミゲル', 'ライリー', 'ローガン', 'ワイアット',
  'アメリア', 'アンナ', 'エミリー', 'エリー', 'キャサリン', 'グレイシー',
  'クロエ', 'サラ', 'ジェンナ', 'ジャスミン', 'ジュリア', 
  'ソフィ', 'ダニエル', 'ハンナ', 'ビクトリア', 'マデレン', 'マリッサ',
  'ミーガン', 'メアリー', 'リリアン', 'レベッカ', 'ローレン'
]

// 名前 (NPC用)
const NPC_LIST: string[] = [
  'アーロン', 'アイゼア', 'アンドリュー', 'イアン', 'エリック', 'オーウェン',
  'ギャレット', 'クーパー', 'ケヴィン', 'コール', 'サム',
  'ジェイデン', 'ジェレミア', 'ショーン', 'ジョセフ', 'スティーブン',
  'ダニエル', 'チェイス', 'ディビッド', 'ティモシー', 'トーマス', 'ドミニク',
  'ニコラス', 'ネイサン', 'パーカー', 'パトリック', 'ブライアン',
  'マシュー', 'メイソン', 'ライアン', 'リチャード', 'ルイス',
  'アシュリン', 'アビー', 'アリアナ', 'アリシア', 'イザベラ', 'エマ',
  'オードリー', 'オリビア', 'キャロライン', 'クレア', 'グレース',
  'ケイト', 'ジェシカ', 'シエラ', 'シドニー', 'シャーロット',
  'ステファニー', 'ゾーィ', 'ディスティニー', 'トリニティ', 'ナタリー', '二コール',
  'ブルック', 'ペイジ', 'マヤ', 'マリア', 'ミア',
  'ミッシェル', 'メリッサ', 'リア', 'リリー', 'レイチェル'
]

// サンプル・キャラクタ生成クラス
class Sample extends Character {
  public tacticType: TacticTypeKey

  constructor(id: number, seed: number, total: number) {
    // シード値を分化して, 乱数を生成する
    const s = seed % DEFAULT_SIZE
    const p = (s + Math.floor(s / 16)) % 4 // 4タイプによる大分類
    const c = Math.floor(s / 4) % 8 // 8タイプによる小分類
    const g = Math.floor(s / 32) % 2 // 性別相当

    // ID, 名前, 能力値を決定し, 初期化
    const model: CharacterModel = {
      id,
      name: NPC_LIST[s],
      points: makeAbilityValues(p, c),
      equipments: []
    }
    super(model)

    // 能力値を修正
    this.modifyAbilities(g, total)

    // 技能をセット
    this.setSkills(p, s, total)

    // 装備をセット
    this.setEquips(s, total)

    // 自動行動タイプをセット
    this.tacticType = this.getTacticType()
  }

  // 可能ならパラメータを step する
  step(name: ParameterKey, total: number) {
    super.step(name)
    if (this.total > total) super.step(name, -1) // 総計を超えたら戻す
  }

  // 能力値を修正
  // HT (生命力) または DX (敏捷力) を +1 する/しない
  modifyAbilities(g: number, total: number) {
    if (g === 0) {
      // HT (生命力) を +1 する
      this.step('生命力', total)
    } else {
      // 可能なら DX (敏捷力) を +1 する
      this.step('敏捷力', total)
    }
  }

  /**
   * 技能修得アルゴリズム
   * 
   * 1. 主技能へ2CPずつ配分
   *   a. 重戦士: 武術
   *   b. 軽戦士: 剣術
   *   c. 魔術師: 魔法2系譜
   *   d. 魔戦士: 魔法1系譜 + 武術
   * 
   * 2. ST, DX が奇数の場合, 優先的に配分 (戦闘能力値が端数切捨のため)
   * 
   * 3. 主技能+副技能の配列をループ
   * 
   * 4. まだCPの余りが生じている場合は, 「鍛錬」「運動」「怪力」に配分
   * 
   */
  setSkills(p: number, s: number, total: number) {
    // 修得すべき技能の配列を作成
    const skills: ParameterKey[] = []
    const spells = ['青の魔法', '赤の魔法', '緑の魔法'] as ParameterKey[]

    // 主技能を配列に追加
    if (p === 0) skills.push('武術')
    if (p === 1 && this.getLevel('生命力') < 11) {
      skills.push('弓術')
    } else if ( p === 1) {
      skills.push('剣術')
    }
    if (p === 2) {
      const selected1 = spells.find((_, i) => i === (s + 1) % 3)!
      const selected2 = spells.find((_, i) => i === (s + 2) % 3)!
      skills.push(selected1, selected2)
    }
    if (p === 3) {
      if (this.get('筋力') < this.get('知力')) {
        skills.push(spells[s % 3], '武術')
      } else {
        skills.push('武術', spells[s % 3])
      }
    }

    // 主技能を2周 step
    for (let i = 0; i < 2; i++) {
      this.step(skills[0], total)
    }

    // 副技能を追加
    skills.push(...SKILL_TABLE[p])

    /**
     * 主技能+副技能の修得ループ
     * 
     * 周回: 合計/能/主/2次/3次 (数)
     * 1周: 10: 8 / 2 / 0 / 0 (0)
     * 2周: 12: 8 / 2 / 1 / 1 (2)
     * 3周: 16: 8 / 4 / 2 / 2 (4)
     * 4周: 24: 8 / 8 / 4 / 4 (8)
     * 5周: 40: 8 / 16 / 8 / 8 (8)
     * 
     */
    let count = 0
    while (this.total < total && count < 10) {
      // 主技能
      this.step(skills[0], total)
      // 2次技能
      this.step(skills[1], total)
      // 3次技能 (1CPないし技能値12が上限)
      skills.slice(1, 2 ** count).forEach(skill => {
        if (this.get(skill) === 0
          || (this.get(skill) < 1 && this.getLevel(skill) < 12)
          || (count > 4 && this.get(skill) < 1 && this.getLevel(skill) < 12)
          || (count > 6 && this.get(skill) < 2 && this.getLevel(skill) < 13)) {
          this.step(skill, total)
        }
      })
      // 8週目以降もCPの余りが生じた場合
      if (count > 8) {
        this.step(['言語', '技術', '知識', '言語'][p] as ParameterKey, total)
      }
      count++
    }
  }

  /**
   * 装備選択アルゴリズム
   * 
   * 1. 必要筋力に応じて武器を選択 (ランダム)
   * 
   * 2. 武器に応じて盾をセット (大盾を扱える場合, ランダムで分岐)
   * 
   * 3. 必要筋力に応じて服・鎧を選択 (STで固定)
   * 
   */
  setEquips(s: number, total: number) {
    // 筋力を取得
    const st = this.getLevel('筋力')

    // 弓使いの場合
    const archerSkill = this.get('弓術')
    if (archerSkill > 0) {
      this.weapon = '長弓'
      this.shield = '装備無し'
      this.armor = st <= 10 ? '革服' : '革鎧'
      return
    }

    // 筋力とCP総計に応じた武器一覧
    const weapons = [
      ['小剣', '棍棒', '長杖'],
      ['長剣', '戦棍', '長槍'],
      ['長剣', '戦棍', '長槍', '長剣', '戦斧', '鉾槍'],
      ['長剣', '戦棍', '長槍', '大剣', '戦斧', '鉾槍']
    ]

    // 武器をセット
    if (st < 10) this.weapon = weapons[0][s % weapons[0].length] as WeaponKey
    if (st >= 10) this.weapon = weapons[1][s % weapons[1].length] as WeaponKey
    if (st >= 12 && total < 12) this.weapon = weapons[2][s % weapons[2].length] as WeaponKey
    if (st >= 12 && total >= 12) this.weapon = weapons[3][s % weapons[3].length] as WeaponKey

    // 盾をセット
    if (!this.weapon.needsTwoHanded) {
      if (st >= 12 && Math.floor(s / 6) % 2 === 0 && total >= 12) this.shield = '大盾'
      else this.shield = '小盾'
    } else {
      this.shield = '装備無し'
    }

    // 服・鎧をセット
    if (st < 9) this.armor = '服'
    if (st === 9) this.armor = '革服'
    if (st === 10 || (st > 10 && total < 12)) this.armor = '革鎧'
    if (st >= 11 && total >= 12) this.armor = 'チェインメイル'
    if (st >= 12 && total >= 16) this.armor = 'プレイトメイル' 
  }

  // 自動行動タイプを取得
  getTacticType(): TacticTypeKey {
    const st = this.getLevel('筋力')
    const dx = this.getLevel('敏捷力')
    const int = this.getLevel('知力')

    if (st >= 12 && int < 12 && this.shield.size > 0) return 'defender'
    else if (st >= 12 && int >= 12) return 'balanced'
    else if (st >= 13 || dx >= 13) return 'attacker'
    else if (st < 12 && int >= 13) return 'supporter'
    else return 'balanced'
  }

  // 戦闘モデル用データ変換 (tacticType (自動行動タイプ) を追加する
  get combatUnitModel(): CombatUnitModel {
    return {
      ...super.combatUnitModel,
      tacticType: this.tacticType
    }
  }
}

// サンプル・キャラクタ群生成関数
// size: 生成数 (範囲内から等間隔にサンプリング)
// total: point 総計
// idOffset: IDのオフセット
export function createSamples(size: number = 4, total: number = 10, idOffset: number = 0, seedOffset: number | null = null) {
  const samples = []
  const step = DEFAULT_SIZE / size // 生成数に応じたステップ
  seedOffset ??= Math.floor(Math.random() * step) // シード値の修正値 (4人PTなら, 0～15の範囲で適用)
  for (let n = 0; n < size; n++) {
    const id = n + idOffset + 1 // オフセットを加え, 1からカウント
    const seed = Math.floor(n * step + seedOffset) % DEFAULT_SIZE
    const sample = new Sample(id, seed, total)
    samples.push(sample)
  }
  return { units: samples, seed: seedOffset }
}

// src/parts/Setup/Edit/index.tsx

import { type Reducer, useReducer, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ParametersSetting from './ParametersSetting'
import { type ParameterKey, Parameters, Equipments, type CharacterModel as Model } from '../../../domains/Character'
import { SaveData } from '../../../domains/SaveData'

export type State = {
  points: number // CP
  gold: number // 軍資金
  prevParams: Parameters // 元のパラメータ
  params: Parameters // 現在のパラメータ
  prevEquips: Equipments // 元の装備
  equips: Equipments // 現在の装備
  name: string // 名前設定
}

export type Action =
  | { type: 'INIT', payload: { prevModel: Model,  model: Model } }
  | { type: 'STEP_PARAM', payload: { prevParams: Parameters, name: ParameterKey, size: number } }
  | { type: 'SET_EQUIP', payload: { prevEquips: Equipments,  slot: 'weapon' | 'shield' | 'armor', name: string } }
  | { type: 'SET_NAME', payload: { name: string } }

function Edit() {
  // navigate, uid を取得
  const navigate = useNavigate()
  let { uid = '00' } = useParams()

  // 新規作成かどうかを変数に格納
  const isNew: boolean = uid === '00' ? true : false

  // セーブデータの読み込み
  const saveData = new SaveData()
  const keys = saveData.loadKeys()

  // 状態初期値
  // → ほとんど最初の useEffect (dispatch({ type: 'INIT'}) で初期値を再代入
  const initialState: State = {
    points: 10,
    gold: 100,
    prevParams: new Parameters(),
    params: new Parameters(),
    prevEquips: new Equipments(),
    equips: new Equipments(),
    name: '未設定'
  }

  // 状態更新 (設定内容)
  const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
      case 'INIT': {
        // 名前, CP を取得
        const name = action.payload.model.name // 一時保存データがあれば優先
        const points = saveData.loadPoints()
        const gold = saveData.loadGold()

        // 元と現在のパラメータ, 装備を取得
        const prevParams = new Parameters(action.payload.prevModel.points)
        const params = new Parameters(action.payload.model.points)
        const prevEquips = action.payload.prevModel.equipments.length
          ? new Equipments(...action.payload.prevModel.equipments) : new Equipments()
        const equips = action.payload.model.equipments.length
          ? new Equipments(...action.payload.model.equipments) : new Equipments()

        return {
          ...state,
          name, points, gold,
          prevParams, params,
          prevEquips, equips
        }
      }

      case 'STEP_PARAM': {
        const nextParams = new Parameters(state.params.model)
        nextParams.step(action.payload.name, action.payload.size)

        return {
          ...state,
          params: nextParams
        }
      }

      default: {
        return state
      }
    }
  }

  // 状態管理 (設定内容)
  const [state, dispatch] = useReducer(reducer, initialState)

  // INIT
  const onInit = () => {
    // LocalStorage からキャラクターデータを取得
    const prevModel: Model = saveData.loadModel(uid)
    // SessionStorage から編集途中のデータを取得
    const model: Model = saveData.loadModel(uid, true)
    // 発火
    dispatch({ type: 'INIT', payload: { prevModel, model } })
  }

  // 残りCPを計算 isMax: true で持ち点を返す
  const calcPoints = (state: State, isMax: boolean = false): number => {
    let points = state.points
    if (!isMax) points -= state.params.total
    return points
  }

  // 作成 (編集) 中断
  const back = () => navigate(keys.size ? '/setup/' : '/')

  // 最初に一度だけ実行
  useEffect(() => {    
    onInit() // 初期化
  }, [])

  return (
    <div className="edit px-6">
      <div className="max-w-[48em] mx-auto">
        <h3>キャラクター{isNew ? '作成' : '編集'}</h3>
        <ParametersSetting isNew={isNew} state={state} dispatch={dispatch} calcPoints={calcPoints} />
        <section className="my-12 text-center">
          {isNew && (
            <p className="text-center">お疲れ様でした。もうすぐキャラクター作成は完了です。
              <br />この内容でよろしければ、確認へ進んでください。
            </p>
          )}
          <button className="w-48 h-12">確認する</button>
          <button className="w-48 h-12" onClick={back}>{isNew ? '作成' : '編集'}中断</button>
        </section>
      </div>
    </div>
  )
}

export default Edit

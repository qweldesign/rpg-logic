// src/parts/index.tsx

import { Link } from 'react-router-dom';
import { SaveData } from '../domains/SaveData';

function Entrance() {
  // セーブデータの読み込み
  const saveData = new SaveData()
  const keys = saveData.loadKeys()
  // セーブデータがあれば編成画面へ, 無ければ新規作成画面へ
  const setup = keys.size ? '/setup/' : '/setup/edit/'

  return (
    <ul className='nav'>
      <li className='nav__item'>
        <Link to="/docs/">ドキュメント</Link>
      </li>
      <li className='nav__item'>
        <Link to={setup}>編成</Link>
      </li>
    </ul>
  )
}

export default Entrance

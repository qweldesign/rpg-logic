// src/parts/Setup/index.tsx

import { useParams, Link } from 'react-router-dom'
import List from '../List'
import Detail from '../List/Detail'
import { SAMPLE_CHARACTERS as samples } from '../../domains/Sample'

function Setup() {
  // uid があれば1人のサンプルを探す
  const { uid } = useParams()
  const sample = samples.find(m => m.id === Number(uid))

  return (
    <div className="px-6">
      {!sample
        ? <List units={samples} />
        : (
          <>
            <Detail unit={sample} />
            <Link className="ms-12 italic" to="/setup/">&lt; Back to list</Link>
          </>
        )
      }
    </div>
  )
}

export default Setup

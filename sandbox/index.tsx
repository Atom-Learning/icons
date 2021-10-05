import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as Icons from '../dist/index.modern'

const App = () => (
  <>
    <style>
      {`
        .container {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
          padding: 64px;
        }
        .container > * {
          flex: 0 0 4%;
          min-width: 16px;
        }
        svg {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 2px;
          stroke: #222;
        }
      `}
    </style>
    <div className="container">
      {Object.entries(Icons).map(([name, Icon]) => (
        <div>
          <Icon key={name} />
        </div>
      ))}
    </div>
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))

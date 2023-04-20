import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as Icons from '../dist'

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
        }
        svg {
          color: #222;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke: currentColor;
        }
        .icon-sm svg{
          stroke-width: 1.5px;
          width: 16px;
        }
        .icon-md svg {
          stroke-width: 1.75px;
          width: 24px;
        }
        .icon-lg svg {
          stroke-width: 2px;
          width: 32px;
        }
      `}
    </style>
    <div className="container">
      {Object.entries(Icons).map(([name, Icon]) => (
        ['sm', 'md', 'lg'].map(size => (
          <div className={`icon-${size}`}>
            <Icon size={size} key={`${name}-${size}`} />
          </div>
        ))
      ))}
    </div>
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))

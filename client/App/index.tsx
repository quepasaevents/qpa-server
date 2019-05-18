import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

const appWrapper = document.createElement('div')
document.body.appendChild(appWrapper)

ReactDOM.render(<App />, appWrapper)

export default App

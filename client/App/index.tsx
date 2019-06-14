import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import Providers from "./Providers"

const appWrapper = document.createElement('div')
document.body.appendChild(appWrapper)

ReactDOM.render((
  <Providers><App /></Providers>
), appWrapper)

export default App

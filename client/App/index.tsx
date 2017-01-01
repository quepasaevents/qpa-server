import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./App"
import Providers from "./Providers"
import css from '@emotion/css'

const appWrapper = document.createElement("div")
appWrapper.id = 'appcontainer'
document.body.appendChild(appWrapper)

ReactDOM.render(
  <Providers>
    <App />
  </Providers>,
  appWrapper
)

const styled = css`
  body {
    margin: 0;
    height: 100vh;
  }
  #appcontainer {
    height: 100%;
  }
`

const styleElem = document.createElement('style')
styleElem.innerText = styled.styles;
document.body.appendChild(styleElem)
export default App

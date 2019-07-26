import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./App"
import Providers from "./Providers"

const container = document.getElementById("app")
ReactDOM.render(
  <Providers>
    <App />
  </Providers>,
  container
)

import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./App"
import Providers from "./Providers"
import css from "@emotion/css"

const container = document.getElementById("app")
ReactDOM.hydrate(
  <Providers>
    <App />
  </Providers>,
  container
)

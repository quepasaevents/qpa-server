import * as React from "react"
import MeQuery, { UserData } from "./MeQuery"

interface IAppContext {
  me: UserData
}

const { Provider, Consumer } = React.createContext<IAppContext>({ me: null })

const AppContextProvider = props => (
  <MeQuery>
    {({ data, loading, error }) => {
      return (
        <Provider value={data}>
          {
            props.children
          }
        </Provider>
      )
    }}
  </MeQuery>
)

export { AppContextProvider, Consumer as AppContext }

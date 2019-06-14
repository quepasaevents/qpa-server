import * as React from "react"
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  Link
} from "react-router-dom"
import Calendar from "../Calendar/Calendar"
import { ApolloProvider } from "react-apollo"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { IdGetterObj, InMemoryCache } from "apollo-cache-inmemory"
import CreateEvent from "../Event/CreateEvent"
import EditEvent from "../Event/EditEvent"
import { RouteComponentProps } from "react-router"
import { AppContextProvider, AppContext } from "./Context/AppContext"
import Header from "./Header/Header"
import Login from "./Auth/Login"
import styled from "@emotion/styled"


const App = () => (
  <Root>
    <Header />
    <Content>
      <Switch>
        <Route path="/create" component={CreateEvent} />
        <Route
          path="/event/:eventId/edit"
          render={(
            routeProps: RouteComponentProps<{ eventId: string }>
          ) => <EditEvent eventId={routeProps.match.params.eventId} />}
        />
        <Route path="/login" component={Login} />
        <Route path="/" component={Calendar} />
        <Redirect to="/" />
      </Switch>
    </Content>
  </Root>
)

const Root = styled.div`

`
const Content = styled.div`
  display: flex;
  justify-content: center;
`
export default App

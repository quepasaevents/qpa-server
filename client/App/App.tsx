import * as React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import Calendar from "../Calendar/Calendar"
import CreateEvent from "../Event/CreateEvent"
import EditEvent from "../Event/EditEvent"
import { RouteComponentProps } from "react-router"
import Header from "./Header/Header"
import Login from "./Auth/Login"
import styled from "@emotion/styled"
import Footer from "./Footer"
import InitializeSession from "./Auth/InitializeSession"
import Signup from "./Auth/Signup"
import Signout from "./Auth/Signout"
import OccurrenceDetails from "./Occurrence/OccurrenceDetails"
import { Global, css } from "@emotion/core"

const App = () => (
  <Root>
    <Global
      styles={css`
        body {
          margin: 0;
          height: 100vh;
        }
        #app {
          height: 100%;
        }
      `}
    />
    <StyledHeader />
    <Content>
      <Switch>
        <Route path="/create" component={CreateEvent} />
        <Route
          path="/event/:eventId/edit"
          render={(routeProps: RouteComponentProps<{ eventId: string }>) => (
            <EditEvent eventId={routeProps.match.params.eventId} />
          )}
        />
        <Route
          path="/o/:sanitizedEventName/:occurrenceId"
          component={OccurrenceDetails}
        />
        <Route path="/init-session/:hash" component={InitializeSession} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/logout" component={Signout} />
        <Route path="/" component={Calendar} />
        <Redirect to="/" />
      </Switch>
    </Content>
    <StyledFooter />
  </Root>
)

const Root = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: [header] 48px [body] 1fr [footer] 32px;
`

const Content = styled.div`
  grid-row: body;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const StyledFooter = styled(Footer)`
  grid-row: footer;
`
const StyledHeader = styled(Header)`
  grid-row: header;
`
export default App

import * as React from 'react'
import {AppContextProvider} from "./Context/AppContext"
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom"
import {ApolloProvider} from "react-apollo"
import {HttpLink} from "apollo-link-http"
import {ApolloClient} from "apollo-client"
import {InMemoryCache} from "apollo-cache-inmemory"

interface Props {
  children: React.ReactChild | React.ReactChildren
}

const httpLink = new HttpLink({
  uri: "/graphql"
})

const graphqlClient = new ApolloClient({
  connectToDevTools: true,
  link: httpLink,
  cache: new InMemoryCache()
}) as ApolloClient<any>


const Providers = (props: Props) => (
  <ApolloProvider client={graphqlClient}>
    <AppContextProvider>
      <Router>
        { props.children }
      </Router>
    </AppContextProvider>
  </ApolloProvider>
)


export default Providers

import * as React from 'react'
import {AppContextProvider} from "../App/Context/AppContext"
import {ApolloProvider} from "react-apollo"
import {ApolloClient} from "apollo-client"
import {InMemoryCache} from "apollo-cache-inmemory"
import { StaticRouter } from 'react-router'

interface Props {
  children: React.ReactChild | React.ReactChildren
  graphqlClient: ApolloClient<InMemoryCache>
  location: string
}

const SSRProviders = (props: Props) => (
  <ApolloProvider client={props.graphqlClient}>
    <AppContextProvider>
      <StaticRouter location={props.location}>
        { props.children }
      </StaticRouter>
    </AppContextProvider>
  </ApolloProvider>
)


export default SSRProviders

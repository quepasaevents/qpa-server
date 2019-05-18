import * as React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Calendar from "../Calendar/Calendar"
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { IdGetterObj, InMemoryCache } from "apollo-cache-inmemory"

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})


const graphqlClient = new ApolloClient({
  connectToDevTools: true,
  link: httpLink,
  cache: new InMemoryCache({
    dataIdFromObject: (o: IdGetterObj) => {
      if (o.id && o.__typename) {
        return `${o.__typename}_${o.id}`
      } else {
        return o.id
      }
    }
  })
}) as ApolloClient<any>

const App = () => (
  <ApolloProvider client={graphqlClient}>
    <Calendar />
  </ApolloProvider>
)
export default App

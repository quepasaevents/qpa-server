import { Request, Response } from "express-serve-static-core"
import * as ReactDOMServer from "react-dom/server"
import { renderStylesToString } from "emotion-server"
import App from "../App/App"
import * as React from "react"
import SSRProviders from "./SSRProviders"
import * as fs from "fs"
import * as path from "path"
import * as Mustache from "mustache"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import fetch from "node-fetch"
import { getDataFromTree } from "react-apollo"
import apolloLogger from "apollo-link-logger"
import { ApolloLink } from "apollo-link"
export const httpSSRHandler = async (req: Request, res: Response) => {
  res.status(200)
  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    fetch,
    headers: {
      cookie: req.header("Cookie")
    }
  })

  const link = ApolloLink.from([apolloLogger, httpLink])

  const graphqlClient = new ApolloClient({
    connectToDevTools: true,
    link,
    cache: new InMemoryCache(),
    ssrMode: true,
  }) as ApolloClient<any>

  const app = (
    <SSRProviders location={req.path} graphqlClient={graphqlClient}>
      <App />
    </SSRProviders>
  )

  const appWithData = await getDataFromTree(app)

  const appBody = renderStylesToString(appWithData)
  const initialState = graphqlClient.extract()

  const template = fs.readFileSync(
    path.join(__dirname, "./index.html.mustache"),
    "utf-8"
  )

  const result = Mustache.render(template, {
    appBody,
    apolloData: JSON.stringify(initialState)
  })
  res.send(result)
}

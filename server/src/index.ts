import GraphQLInterface from "./graphql"
import SessionManager from "./Auth/SessionManager"

async function start() {
  const gql = new GraphQLInterface({
    sessionManager: new SessionManager()
  })
  gql.start()

}

start()

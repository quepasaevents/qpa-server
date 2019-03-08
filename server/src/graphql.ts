import SessionManager from "./auth/SessionManager"
import CalendarManager from "./Calendar/CalendarManager"
import {ApolloServer} from 'apollo-server'
import {makeExecutableSchema} from "graphql-tools"
import EventsResolvers from './Events/eventsResolvers'
import {importSchema} from 'graphql-import'
import AuthResolvers from "./Auth/authResolvers"

interface Dependencies {
  sessionManager: SessionManager,
}

export default class GraphQLInterface {
  sessionManager: SessionManager

  constructor(dependencies: Dependencies) {
    this.sessionManager = dependencies.sessionManager
  }

  start = () => {

    const authResolvers = new AuthResolvers({
      sessionManager: this.sessionManager,
    })

    const typeDefs = importSchema(__dirname + '/schema.graphql')

    const schema = makeExecutableSchema({
      typeDefs: [
        typeDefs
      ],
      resolvers: {
        Query: {
          ...this.resolvers.Query,
          ...EventsResolvers.Query,
          ...authResolvers.Query
        },
        Mutation: {
          ...this.resolvers.Mutation,
          ...EventsResolvers.Mutation,
          ...authResolvers.Mutation
        }
      },
    })

    const server = new ApolloServer({schema})
    server.listen().then(({url}) => {
      console.log(`🚀  Server ready at ${url}`)
    })
  }

  resolvers = {
    Query: {},
    Mutation: {}
  }
}



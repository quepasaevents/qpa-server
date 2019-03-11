import SessionManager from "./auth/SessionManager"
import CalendarManager from "./Calendar/CalendarManager"
import {ApolloServer} from 'apollo-server'
import {makeExecutableSchema} from "graphql-tools"
import EventsResolvers from './Events/eventsResolvers'
import {importSchema} from 'graphql-import'
import AuthResolvers from "./Auth/authResolvers"
import {Connection} from "typeorm"
import {PostOffice, sendEmail} from "./post_office";
import {Session} from "./Auth/Session.entity";
import {Context} from "./@types/graphql-utils";

interface Dependencies {
  typeormConnection: Connection
  sendEmail: PostOffice
}

const resolvers = {
  Query: {},
  Mutation: {}
}

export const createServer = async (dependencies: Dependencies) => {

  const authResolvers = new AuthResolvers({
    sendEmail: dependencies.sendEmail
  })

  const typeDefs = importSchema(__dirname + '/schema.graphql')

  const schema = makeExecutableSchema({
    typeDefs: [
      typeDefs
    ],
    resolvers: {
      Query: {
        ...resolvers.Query,
        ...EventsResolvers.Query,
        ...authResolvers.Query
      },
      Mutation: {
        ...resolvers.Mutation,
        ...EventsResolvers.Mutation,
        ...authResolvers.Mutation
      },
      UserSession: {
        ...authResolvers.UserSession
      }
    },
  })

  return new ApolloServer({
    schema,
    context: async (a) => {
      const ctx: Context = {
        req: a.req
      }
      if (a.req && a.req.headers.authentication) {
        ctx.session = await Session.findOne({hash: a.req.headers.authentication as string})
      }
    }
  })
}

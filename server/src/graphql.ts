import {ApolloServer} from 'apollo-server'
import {makeExecutableSchema} from "graphql-tools"
import EventsResolvers from './Events/eventsResolvers'
import {importSchema} from 'graphql-import'
import AuthResolvers from "./Auth/authResolvers"
import {Connection} from "typeorm"
import {PostOffice} from "./post_office"
import {Session} from "./Auth/Session.entity"
import {Context} from "./@types/graphql-utils"

interface Dependencies {
  typeormConnection: Connection
  sendEmail: PostOffice
  domain?: string
  customContext?: Context
}

const resolvers = {
  Query: {},
  Mutation: {}
}

export const createServer = async (dependencies: Dependencies) => {

  const authResolvers = new AuthResolvers({
    sendEmail: dependencies.sendEmail,
    emailTargetDomain: dependencies.domain,
  })

  const typeDefs = importSchema(__dirname + '/../../schema.graphql')

  const { Query: EventQueryResolvers, Mutation: EventResolversMutation,...eventResolvers} = EventsResolvers

  const schema = makeExecutableSchema({
    typeDefs: [
      typeDefs
    ],
    resolvers: {
      Query: {
        ...resolvers.Query,
        ...EventQueryResolvers,
        ...authResolvers.Query
      },
      Mutation: {
        ...resolvers.Mutation,
        ...EventResolversMutation,
        ...authResolvers.Mutation
      },
      UserSession: {
        ...authResolvers.UserSession
      },
      ...eventResolvers
    },
  })

  return new ApolloServer({
    schema,
    context: dependencies.customContext ? dependencies.customContext : async (a) => {
      const ctx: Context = {
        req: a.req
      }
      if (a.req && a.req.headers.authentication) {
        const session = await Session.findOne({hash: a.req.headers.authentication as string})
        if (session) {
          ctx.user = session.user
        }
      }

      return ctx
    }
  })
}

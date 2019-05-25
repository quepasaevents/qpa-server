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
      if (a.req.headers.cookie) {
        const cookies: any = a.req.headers.cookie.split(';').map(s => s.trim().split('=')).reduce((acc, val)=> {acc[val[0]] = val[1]; return acc},{})
        if (cookies.authentication) {
          const session = await Session.findOne({hash: cookies.authentication as string})
          if (session) {
            ctx.user = session.user
          }
        }
      }

      return ctx
    }
  })
}

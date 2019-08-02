import {ApolloServer} from 'apollo-server-express'
import {makeExecutableSchema} from "graphql-tools"
import EventsResolvers from './Events/eventsResolvers'
import UserResolvers from './Auth/userResolvers'
import {importSchema} from 'graphql-import'
import AuthResolvers from "./Auth/authResolvers"
import {Connection} from "typeorm"
import {PostOffice} from "./post_office"
import {Session} from "./Auth/Session.entity"
import {Context} from "./@types/graphql-utils"
import SessionManager from "./Auth/SessionManager"

interface Dependencies {
  typeormConnection: Connection
  sendEmail: PostOffice
  domain?: string
  customContext?: Context
  sessionManager: SessionManager
}

const resolvers = {
  Query: {},
  Mutation: {}
}

export const createServer = async (dependencies: Dependencies) => {

  const authResolvers = new AuthResolvers({
    sendEmail: dependencies.sendEmail,
    emailTargetDomain: dependencies.domain,
    sessionManager: dependencies.sessionManager
  })

  const typeDefs = importSchema(__dirname + '/schema.graphql')

  const { Query: EventQueryResolvers, Mutation: EventResolversMutation,...eventResolvers} = EventsResolvers
  const { Query: UserQueryResolvers, Mutation: UserMutationResolvers, ...userResolvers} = UserResolvers

  const schema = makeExecutableSchema({
    typeDefs: [
      typeDefs
    ],
    resolvers: {
      Query: {
        ...resolvers.Query,
        ...EventQueryResolvers,
        ...authResolvers.Query,
          ...UserQueryResolvers,
      },
      Mutation: {
        ...resolvers.Mutation,
        ...EventResolversMutation,
        ...authResolvers.Mutation,
        ...UserMutationResolvers,
      },
      UserSession: {
        ...authResolvers.UserSession
      },
      ...eventResolvers,
      ...userResolvers,

    },
  })

  return new ApolloServer({
    schema,
    context: dependencies.customContext ? dependencies.customContext : async (a) => {
      const ctx: Context = {
        req: a.req
      }
      let authToken
      if (a.req.header('authentication')) {
        authToken = a.req.header('authentication')
      }
      if (a.req.headers.cookie) {
        console.log('a.req.headers.cookie', a.req.headers.cookie)
        const cookies: any = a.req.headers.cookie.split(';').map(s => s.trim().split('=')).reduce((acc, val)=> {acc[val[0]] = val[1]; return acc},{})

        if (cookies.authentication) {
          authToken = cookies.authentication as string
        }
      }
      if (authToken) {
        const session = await Session.findOne({hash: authToken})
        if (session) {
          ctx.user = session.user
        }
      }

      return ctx
    }
  })
}

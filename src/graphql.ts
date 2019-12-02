import { ApolloServer } from "apollo-server-express"
import { makeExecutableSchema } from "graphql-tools"
import EventsResolvers from "./Events/eventsResolvers"
import UserResolvers from "./Auth/userResolvers"
import { importSchema } from "graphql-import"
import AuthResolvers from "./Auth/authResolvers"
import { Connection } from "typeorm"
import { PostOffice } from "./post_office"
import { Session } from "./Auth/Session.entity"
import { Context } from "./@types/graphql-utils"
import SessionManager from "./Auth/SessionManager"
import { tagResolvers } from "./Calendar/tagsResolvers"
import ImageBucketService from "./Image/ImageBucketService"
import { EventImageResolvers } from "./Image/eventImageResolvers"
import revisionResolvers from './Events/revisionResolvers'

interface Dependencies {
  typeormConnection: Connection
  sendEmail: PostOffice
  domain?: string
  customContext?: Context
  sessionManager: SessionManager
  imageBucketService: ImageBucketService
}

const resolvers = {
  Query: {},
  Mutation: {},
}

export const createServer = async (
  dependencies: Dependencies
): Promise<ApolloServer> => {
  const authResolvers = new AuthResolvers({
    sendEmail: dependencies.sendEmail,
    emailTargetDomain: dependencies.domain,
    sessionManager: dependencies.sessionManager,
  })

  const eventImageResolvers = EventImageResolvers(
    dependencies.imageBucketService
  )
  const typeDefs = importSchema(__dirname + "/schema.graphql")
    .replace(
    "scalar Upload",
    ""
  )
  const {
    Query: EventQueryResolvers,
    Mutation: EventResolversMutation,
    ...eventResolvers
  } = EventsResolvers
  const {
    Query: UserQueryResolvers,
    Mutation: UserMutationResolvers,
    ...userResolvers
  } = UserResolvers

  return new ApolloServer({
    typeDefs,
    resolvers: {
      Query: {
        ...resolvers.Query,
        ...EventQueryResolvers,
        ...authResolvers.Query,
        ...UserQueryResolvers,
        ...tagResolvers.Query,
        ...eventImageResolvers.Query,
        ...revisionResolvers.Query
      },
      Mutation: {
        ...resolvers.Mutation,
        ...EventResolversMutation,
        ...authResolvers.Mutation,
        ...UserMutationResolvers,
        ...tagResolvers.Mutation,
        ...eventImageResolvers.Mutation,
        ...revisionResolvers.Mutation
      },
      UserSession: {
        ...authResolvers.UserSession,
      },
      EventTag: {
        ...tagResolvers.EventTag,
      },
      EventRevision: {
        ...revisionResolvers.EventRevision
      },
      ...eventResolvers,
      ...userResolvers,
    },
    context: dependencies.customContext
      ? dependencies.customContext
      : async a => {
          const ctx: Context = {
            req: a.req,
          }
          let authToken
          if (a.req.header("authentication")) {
            authToken = a.req.header("authentication")
          }
          if (a.req.headers.cookie) {
            console.log("a.req.headers.cookie", a.req.headers.cookie)
            const cookies: any = a.req.headers.cookie
              .split(";")
              .map(s => s.trim().split("="))
              .reduce((acc, val) => {
                acc[val[0]] = val[1]
                return acc
              }, {})

            if (cookies.authentication) {
              authToken = cookies.authentication as string
            }
          }
          if (authToken) {
            const session = await Session.findOne({ hash: authToken })
            if (session) {
              ctx.user = session.user
            }
          }

          return ctx
        },
  })
}

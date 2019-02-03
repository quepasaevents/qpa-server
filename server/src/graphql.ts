import Repository from "./repository";
import UserManager from "./user";
import SessionManager from "./auth/SessionManager";
import CalendarManager from "./Calendar/CalendarManager";
import EventManager from "./Events/EventManager";
import {ApolloServer} from 'apollo-server';
import {makeExecutableSchema} from "graphql-tools";
import EventsResolvers from './Events/eventsResolvers'
import {importSchema} from 'graphql-import';
import AuthResolvers from "./Auth/authResolvers";
import { DIRECTIVES } from 'graphql-codegen-typescript-mongodb';

interface Dependencies {
  repository: Repository,
  userManager: UserManager,
  sessionManager: SessionManager,
  calendarManager: CalendarManager,
  eventManager: EventManager
}

export default class GraphQLInterface {
  repository: Repository
  userManager: UserManager
  sessionManager: SessionManager
  calendarManager: CalendarManager
  eventManager: EventManager

  constructor(dependencies: Dependencies) {
    this.repository = dependencies.repository
    this.userManager = dependencies.userManager
    this.sessionManager = dependencies.sessionManager
    this.calendarManager = dependencies.calendarManager
    this.eventManager = dependencies.eventManager
  }

  start = () => {
    const eventsResolvers = new EventsResolvers({
      eventManager: this.eventManager,
      calendarManager: this.calendarManager
    })
    const authResolvers = new AuthResolvers({
      repository: this.repository,
      sessionManager: this.sessionManager,
      userManager: this.userManager
    })

    const typeDefs = importSchema(__dirname + '/schema.graphql');
    console.log('typeDefs', typeDefs)

    const schema = makeExecutableSchema({
      typeDefs: [
        DIRECTIVES,
        ...typeDefs
      ],
      resolvers: {
        Query: {
          ...this.resolvers.Query,
          ...eventsResolvers.Query,
          ...authResolvers.Query
        },
        Mutation: {
          ...this.resolvers.Mutation,
          ...eventsResolvers.Mutation,
          ...authResolvers.Mutation
        }
      },
    });

    const server = new ApolloServer({schema});
    server.listen().then(({url}) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  }

  resolvers = {
    Query: {},
    Mutation: {}
  };
}



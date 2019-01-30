import {Repository} from "./repository";
import UserManager from "./user";
import SessionManager from "./session";
import CalendarManager from "./calendar";
import EventManager from "./event";
import {ApolloServer} from 'apollo-server';
import {makeExecutableSchema} from "graphql-tools";
import EventsResolvers from './Events/eventsResolvers'
import { importSchema } from 'graphql-import';

const typeDefs = importSchema(__dirname + '/schema.graphql');

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
    const eventsResolvers = new EventsResolvers({repository: this.repository, calendarManager: this.calendarManager})

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        Query: {
          ...this.resolvers.Query,
          ...eventsResolvers.Query
        },
        Mutation: {
          ...this.resolvers.Mutation,
          ...eventsResolvers.Mutation
        }
      },
    });

    const server = new ApolloServer({schema});
    server.listen().then(({url}) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  }

  resolvers = {
    Query: {
    },
    Mutation: {

    }
  };
}



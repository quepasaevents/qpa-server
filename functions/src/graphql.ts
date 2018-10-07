import {buildSchema} from "graphql";
import {Repository} from "./repository";
import UserManager from "./user";
import SessionManager from "./session";
import CalendarManager from "./calendar";
import EventManager from "./event";
import graphqlHTTP, {Middleware} from 'express-graphql';

export const schema = buildSchema(`
  type Event {
    id: String
  } 
  type Query {
    events: [Event]
  }
`);

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
  httpHandler: Middleware

  constructor(dependencies: Dependencies) {
    this.repository = dependencies.repository
    this.userManager = dependencies.userManager
    this.sessionManager = dependencies.sessionManager
    this.calendarManager = dependencies.calendarManager
    this.eventManager = dependencies.eventManager

    this.httpHandler = graphqlHTTP({
      schema: schema,
      rootValue: this.resolvers,
      graphiql: true,
    })
  }

  static schema = schema

  resolvers = {
    events: async (req) => {
      const events = await this.calendarManager.listEvents()
      return events;
    },
  };
}



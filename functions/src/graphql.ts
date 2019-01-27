import {Repository} from "./repository";
import UserManager from "./user";
import SessionManager from "./session";
import CalendarManager from "./calendar";
import EventManager from "./event";
import {User} from "./types";
import {ApolloServer} from 'apollo-server';
import {makeExecutableSchema} from "graphql-tools";

import gql from 'graphql-tag';
import {readFileSync} from 'fs';
import has = Reflect.has;

const typeDefs = readFileSync(__dirname + '/schema.graphqls', 'utf8');

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
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: this.resolvers,
    });

    const server = new ApolloServer({schema});

    server.listen().then(({url}) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  }

  resolvers = {
    Query: {
      events: async (req) => {
        return await this.calendarManager.listEvents()
      }
    },
    Mutation: {
      signup: async (_, req, context, info) => {
        const {username, email, firstName, lastName} = req;
        let newUser: User = null
        try {
          newUser = await this.userManager.createUser({username, email, firstName, lastName})
        } catch (e) {
          console.error('Caught error when creating user for input', req.input);
        }
        return !!newUser
      },
      signin: async (_, { hash }, context, info) => {
        const session = await this.sessionManager.initiateSession({ hash });
        if (!session || !session.isValid) {
          throw new Error('Could not find session invite')
        }
        // set cookie?
      },
      requestInvite: async (_, { email }, context, info) => {
        const invite = await this.sessionManager.inviteUser(email)
        if (!invite) {
          throw new Error('Invitation failed')
        }
        return true
      },
      createEvent: async (_, input) => {

      }

    }
  };
}



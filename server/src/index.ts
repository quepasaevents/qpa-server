import {gcal as gcalConfig, projectId} from "./config";
import UserManager from "./user";
import SessionManager from "./Auth/SessionManager";
import Repository from './repository'
import Calendar from "./Calendar/CalendarManager";
import EventManager from "./Events/EventManager";
import GraphQLInterface from "./graphql";
import {EventsRepository} from "./Events/EventsRepository";
import AuthRepository from "./Auth/AuthRepository";

async function start() {
  const repository = new Repository(projectId)
  await repository.connect()

  const authRepository = new AuthRepository({repository})
  const userManager = new UserManager(authRepository)
  const sessionManager = new SessionManager(authRepository)
  const eventsRepository = new EventsRepository({repository})
  const calendarManager = new Calendar({
    eventsRepository: eventsRepository,
    gcalConfig: gcalConfig
  })
  const eventManager = new EventManager({calendarManager, eventsRepository})

  const gql = new GraphQLInterface({
    repository,
    userManager,
    sessionManager,
    calendarManager,
    eventManager,
  });

  gql.start()

}

start()

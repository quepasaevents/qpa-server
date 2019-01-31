import {gcal as gcalConfig, projectId} from "./config";
import UserManager from "./user";
import SessionManager from "./session";
import Repository from './repository'
import Calendar from "./Calendar/CalendarManager";
import EventManager from "./Events/EventManager";
import GraphQLInterface from "./graphql";
import {EventsRepository} from "./Events/EventsRepository";

async function start() {
  const repository = new Repository(projectId)
  await repository.connect()

  const userManager = new UserManager(repository)
  const sessionManager = new SessionManager(repository)
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

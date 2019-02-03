import EventManager from './EventManager'
import CalendarManager from "../Calendar/CalendarManager";
import CreateEventResolver = MutationResolvers.CreateEventResolver;
import {MutationResolvers} from "../@types";
import CreateEventArgs = MutationResolvers.CreateEventArgs;

export default class EventsResolvers {
  eventManager: EventManager
  calendarManager: CalendarManager

  constructor({eventManager, calendarManager}: {eventManager: EventManager, calendarManager: CalendarManager}) {
    this.eventManager = eventManager;
    this.calendarManager = calendarManager;
  }

  Query = {
    events: async (req) => {
      return this.eventManager.listEvents({})
    },
  }

  Mutation: {
    createEvent: CreateEventResolver
  } = {
    createEvent: async (_, args: CreateEventArgs) => {
      const event = await this.eventManager.createEvent(args.input)
      return event
    }
  }
}

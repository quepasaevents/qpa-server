import {CalendarEvent} from "../types";
import EventManager from './EventManager'
import CalendarManager from "../Calendar/CalendarManager";

interface EventsQueryResolvers {
  events: (req: any) => Promise<CalendarEvent[]>
}

type CreateEventInput = {

}

interface EventsMutationResolvers {
  createEvent: (_, input: CreateEventInput) => Promise<CalendarEvent>
}

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

  Mutation = {
    createEvent: async (_, input) => {
      return 1
    }
  }
}

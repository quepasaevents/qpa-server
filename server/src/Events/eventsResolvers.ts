import {Repository} from "../repository";
import CalendarManager from "../calendar";
import {CalendarEvent} from "../types";

interface EventsQueryResolvers {
  events: (req: any) => Promise<CalendarEvent[]>
}

type CreateEventInput = {

}

interface EventsMutationResolvers {
  createEvent: (_, input: CreateEventInput) => Promise<CalendarEvent>
}

export default class EventsResolvers {
  repository: Repository
  calendarManager: CalendarManager

  constructor({repository, calendarManager}) {
    this.repository = repository;
    this.calendarManager = calendarManager
  }

  Query = {
    events: async (req) => {
      return this.calendarManager.listEvents()
    },
  }

  Mutation = {
    createEvent: async (_, input) => {
      return 1
    }
  }
}

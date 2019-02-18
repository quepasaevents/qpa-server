import {EventsRepository} from './EventsRepository'
import CalendarManager from "../Calendar/CalendarManager";
import {CalendarEvent, CalendarEventDbObject, CreateEventInput} from "../@types";

export interface EventsListFilter {
  tags?: {
    include?: string[]
    exclude?: string[]
  }
  earliest?: Date
  latest?: Date
  limit?: number
  skip?: number
}

export default class EventManager {
  eventsRepository: EventsRepository
  calendarManager: CalendarManager

  constructor({eventsRepository, calendarManager}: { eventsRepository: EventsRepository, calendarManager: CalendarManager }) {
    this.eventsRepository = eventsRepository;
    this.calendarManager = calendarManager;
  }

  async createEvent(eventDetails: CreateEventInput): Promise<CalendarEvent> {
    let dbEvent
    try {
      dbEvent = await this.eventsRepository.createEvent(eventDetails)
      console.log('Event created on the db', JSON.stringify(dbEvent))
    } catch (e) {
      console.error('Error while persisting new event:', e)
    }

    if (!(dbEvent && dbEvent.id)) {
      console.error('Could not get persisted event from the database')
      return null
    }

    return dbEvent;
  }

  async listEvents(filter: EventsListFilter): Promise<CalendarEventDbObject[]> {
    return this.eventsRepository.getEvents(filter)
  }
}

import {EventsRepository} from './EventsRepository'
import {CalendarEvent} from "../types";
import CalendarManager from "../Calendar/CalendarManager";

export interface EventsListFilter {
  tags?: {
    include?: string[]
    exclude?: string[]
  }
  earliest?: Date
  latest?: Date
  count?: number
  skip?: number
}

export default class EventManager {
  eventsRepository: EventsRepository
  calendarManager: CalendarManager

  constructor({eventsRepository, calendarManager}: { eventsRepository: EventsRepository, calendarManager: CalendarManager }) {
    this.eventsRepository = eventsRepository;
    this.calendarManager = calendarManager;
  }

  async createEvent(eventDetails: CalendarEvent): Promise<CalendarEvent> {
    let dbEvent
    try {
      dbEvent = await this.eventsRepository.createEvent(eventDetails)
      console.log('Event created on the db', JSON.stringify(dbEvent))
    } catch (e) {
      console.error('Error while persisting new event', e)
    }

    if (!(dbEvent && dbEvent.id)) {
      console.error('Could not get persisted event from the database')
      return null
    }

    let calEventId
    try {
      calEventId = await this.calendarManager.createEvent(dbEvent)
    } catch (e) {
      console.error('Error saving event with calendar API', e)
    }

    if (!calEventId) {
      console.warn(`Could not persist event on calendar. Event id: ${dbEvent.id}`)
    } else {
      dbEvent.gcalEntryId = calEventId
      await this.eventsRepository.updateEvent(dbEvent)
    }

    return dbEvent;
  }

  async listEvents(filter: EventsListFilter): Promise<CalendarEvent[]> {
    console.warn('Not implemented')
    return []
  }

}

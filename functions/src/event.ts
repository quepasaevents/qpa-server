import Calendar from './calendar';
import Repository from "./repository";
import {CalendarEvent} from './types'

export default class EventManager {
  calendar: Calendar
  repository: Repository

  constructor(calendar: Calendar, repository: Repository) {
    this.calendar = calendar
    this.repository = repository
  }

  validateEventData(eventDetails: CalendarEvent) {
      return true
  }

  createEvent(eventDetails: CalendarEvent) {
    if (!this.validateEventData(eventDetails)) {
      return
    }
  }


}
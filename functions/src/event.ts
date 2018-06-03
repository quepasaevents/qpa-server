import CalendarManager from './calendar';
import Repository from "./repository";
import {CalendarEvent} from './types'

export default class EventManager {
  calendarManager: CalendarManager
  repository: Repository

  constructor(calendar: CalendarManager, repository: Repository) {
    this.calendarManager = calendar
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
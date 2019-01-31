import { EventsRepository } from './EventsRepository'
export default class EventsManager {
  eventsRepository: EventsRepository

  constructor({eventsRepository}) {
    this.eventsRepository = eventsRepository;
  }
}

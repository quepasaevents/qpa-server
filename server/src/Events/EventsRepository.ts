import Repository, {transformId, OIDable, Collections} from "../repository";
import {CalendarEvent, CreateEventInput} from "../@types";

class EventsRepository {
  repository: Repository
  c: Collections

  constructor({repository}) {
    this.repository = repository
    this.c = repository.c;
  }

  async createEvent(event: CreateEventInput): Promise<CalendarEvent> {
    const insertResult = await this.c.events.insertOne(event as OIDable<CalendarEvent>)
    if (insertResult.result.ok !== 1) {
      throw new Error(`Could new insert event ${JSON.stringify(event)}`)
    }
    return this.c.events.findOne({
      _id: insertResult.insertedId
    })
  }

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const {id, ...strippedFromId} = event;
    const updateResult = await this.c.events.updateOne({
      _id: event.id
    }, strippedFromId as OIDable<CalendarEvent>)
    if (updateResult.result.ok !== 1) {
      throw new Error(`Error updating event ${event.id}`)
    }
    return this.c.events.findOne({_id: event.id})
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    return this.c.events.findOne({_id: id})
  }

}

export { EventsRepository };

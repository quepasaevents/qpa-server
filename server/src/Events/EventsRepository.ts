import Repository, {transformId, OIDable, Collections} from "../repository";
import {CalendarEvent} from "../types";

class EventsRepository {
  repository: Repository
  c: Collections

  constructor({repository}) {
    this.repository = repository
    this.c = repository.c;
  }

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const insertResult = await this.c.events.insertOne(event as OIDable<CalendarEvent>)
    if (insertResult.result.ok !== 1) {
      throw new Error(`Could new insert event ${JSON.stringify(event)}`)
    }
    return transformId(await this.c.events.findOne({
      _id: insertResult.insertedId
    })) as CalendarEvent
  }

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const {id, ...strippedFromId} = event;
    const updateResult = await this.c.events.updateOne({
      _id: event.id
    }, strippedFromId as OIDable<CalendarEvent>)
    if (updateResult.result.ok !== 1) {
      throw new Error(`Error updating event ${event.id}`)
    }
    const result = await this.c.events.findOne({_id: event.id})
    return transformId(result) as CalendarEvent
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    return transformId(await this.c.events.findOne({_id: id})) as CalendarEvent
  }

}

export { EventsRepository };

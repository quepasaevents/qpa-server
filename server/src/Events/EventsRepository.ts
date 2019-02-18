import Repository, {transformId, OIDable, Collections} from "../repository";
import {CalendarEvent, CalendarEventDbObject, CreateEventInput} from "../@types";
import {EventsListFilter} from "./EventManager";

class EventsRepository {
  repository: Repository
  c: Collections

  constructor({repository}) {
    this.repository = repository
    this.c = repository.c;
  }

  async createEvent(event: CreateEventInput): Promise<CalendarEventDbObject> {
    const insertResult = await this.c.events.insertOne(event as any as CalendarEventDbObject)
    if (insertResult.result.ok !== 1) {
      throw new Error(`Could new insert event ${JSON.stringify(event)}`)
    }
    return this.c.events.findOne({
      _id: insertResult.insertedId
    })
  }

  async updateEvent(event: CalendarEvent): Promise<CalendarEventDbObject> {
    const {id, owner, ...strippedFromId} = event;

    const updateResult = await this.c.events.updateOne({
      _id: event.id
    }, strippedFromId as CalendarEventDbObject)
    if (updateResult.result.ok !== 1) {
      throw new Error(`Error updating event ${event.id}`)
    }
    return this.c.events.findOne({_id: event.id})
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    return this.c.events.findOne({_id: id})
  }

  async getEvents(filter: EventsListFilter): Promise<CalendarEventDbObject[]> {
    return this.c.events.find({}).limit(filter.limit).toArray()
  }

}

export { EventsRepository };

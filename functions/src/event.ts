import CalendarManager from './calendar';
import Repository from "./mongorepo";
import { CalendarEvent } from './types'
import JoiBase from "joi";
import JoiTimezone from 'joi-timezone';
import JoiPhoneNumber from 'joi-phone-number'
import gql from 'graphql-tag';

const Joi = JoiBase
  .extend(JoiTimezone)
  .extend(JoiPhoneNumber)

const eventSchema = gql`
    type Event {
        id: ID
        owner: User!
        info: [EventInformation]
    }
    # Event information for presentation
    type EventInformation {
        
    }
    
    input TimeInput {
        # in format  "yyyy-mm-dd" for all-day event
        date: String
        # in RFC3339 e.g. 2002-10-02T10:00:00-05:00 or 2002-10-02T15:00:00Z
        dateTime: String
        # IANA Timezone e.g. "Europe/Zurich"
        timeZone: string
    }
    input EventTimeInput {
        timeZone: String
        #  "confirmed" | "tentative" | "cancelled"
        status: String
        start: TimeInput
        end: TimeInput
    }
    input EventContactInput {
        email: String
        phone: String
    }
    input EventInformationInput {
        language: String
        title: String
        contact: EventContactInput
    }
    input GeoCoordinateInput {
        lat: Float
        lng: Float
    }
    input EventLocationInput {
        address: String
        name: String
        coordinate: GeoCoordinateInput
    }
    input EventMetaInput {
        tags: [String]
    }
    input CreateEventInput {
        time: EventTimeInput
        info: [EventInformationInput]
        location: EventLocationInput
        meta: EventMetaInput
    }
`

const EventTimingSchema = Joi.any()

export const UserEventSchema: JoiBase.Schema = Joi.object().keys({
  timeZone: Joi.string().timezone(),
  owner: Joi.number().required(),
  contactPhone: Joi.string().phoneNumber(),
  contactEmail: Joi.string().email(),
  locationAddress: Joi.string(),
  location: Joi.string(),
  locationCoordinate: Joi.array().items(Joi.number().min(-180).max(180)).length(2),
  title: Joi.string().min(5).max(120),
  description: Joi.string().min(160),
  imageUrl: Joi.string(),
  tags: Joi.array().items(Joi.string()).min(1),
  gcalEntry: Joi.number(),
  timing: EventTimingSchema.required()
}).or('location', 'locationAddress', 'locationCoordinate')

export default class EventManager {
  calendarManager: CalendarManager
  repository: Repository

  constructor(calendar: CalendarManager, repository: Repository) {
    this.calendarManager = calendar
    this.repository = repository
  }

  getValidationErrors(eventDetails: CalendarEvent): Error {
    return UserEventSchema.validate(eventDetails).error
  }

  async createEvent(eventDetails: CalendarEvent): Promise<CalendarEvent> {
    let dbEvent
    try {
      dbEvent = await this.repository.createEvent(eventDetails)
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
      await this.repository.updateEvent(dbEvent)
    }

    return dbEvent;
  }
}

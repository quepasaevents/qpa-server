import Calendar from './calendar';
import Repository from "./repository";
import {CalendarEvent} from './types'
import * as JoiBase from "joi";
import * as JoiTimezone from 'joi-timezone';
import * as JoiPhoneNumber from 'joi-phone-number'

const Joi = JoiBase
  .extend(JoiTimezone)
  .extend(JoiPhoneNumber)



const EventTimingSchema = Joi.any()

export const EventSchema = Joi.object().keys({
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
  gcalEntry: Joi.number().required(),
  timing: EventTimingSchema.required()
}).or('location', 'locationAddress', 'locationCoordinate')

export default class EventManager {
  calendar: Calendar
  repository: Repository

  constructor(calendar: Calendar, repository: Repository) {
    this.calendar = calendar
    this.repository = repository
  }

  validateEventData(eventDetails: CalendarEvent) {
      return EventSchema.validate(eventDetails)
  }

  createEvent(eventDetails: CalendarEvent) {
    if (!this.validateEventData(eventDetails)) {
      return
    }
  }


}
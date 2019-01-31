import {auth} from 'google-auth-library';
import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";
import {atob} from 'atob';
import {CalendarEvent} from "../types";
import {EventsRepository} from "../Events/EventsRepository";

type GCalConfig = {
  calendarId: string
  privateKeyBase64: string
  clientEmail: string
}
export default class CalendarManager {
  eventsRepository: EventsRepository
  gcalConfig: GCalConfig
  gcalBaseURL: string

  constructor(options: {
    eventsRepository: EventsRepository,
    gcalConfig: GCalConfig,
  }) {
    this.eventsRepository = options.eventsRepository
    this.gcalConfig = options.gcalConfig
    this.gcalBaseURL = `https://www.googleapis.com/calendar/v3/calendars/${options.gcalConfig.calendarId}`
  }

  getClient = async () => {
    const client: any = auth.fromJSON({
      private_key: atob(this.gcalConfig.privateKeyBase64),
      client_email: this.gcalConfig.clientEmail
    });

    client.scopes = ['https://www.googleapis.com/auth/calendar'];
    await client.authorize()
    return client as OAuth2Client;
  }

  createPrimaryCalendar = async () => {
    const client = await this.getClient()
    const res = await client.request({
      method: 'post',
      url: 'https://www.googleapis.com/calendar/v3/calendars',
      data: {
        summary: 'primary events calendar'
      }
    });
    return res.data
  }

  listCalendars = async () => {
    const client = await this.getClient()
    const res = await client.request({
      url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    });
    return (res.data as any).items;
  }

  listEvents = async () => {
    const client = await this.getClient()
    let eventsResponse
    try {
      eventsResponse = await client.request({
        method: 'get',
        url: `${this.gcalBaseURL}/events`,
      })
    } catch (e) {
      console.error('Error fetching events', e)
      throw e;
    }


    const eventsDBPromises = []
    const dbIdToGCalEvents = {}

    eventsResponse.data.items.forEach(gCalEvent => {
      const dbId = gCalEvent.extendedProperties.private.eventId;
      dbIdToGCalEvents[dbId] = gCalEvent
      eventsDBPromises.push(
        this.eventsRepository.getEvent(dbId)
          .catch(e => {
            console.warn(`Error fetching DB event ${dbId}, will skip this one`, e)
            return null;
          })
      )
    });

    const allEvents = await Promise.all(eventsDBPromises)
    const result = allEvents.filter(Boolean).map(dbEvent => ({
      ...dbEvent,
      ...dbIdToGCalEvents[dbEvent.id]
    }))

    return result
  }

  createEvent = async (event: CalendarEvent): Promise<String> => {
    if (!event.id || !event.timing) {
      throw new Error('Event doesn\'t have id or timing data')
    }
    const calEvent = {
      ...event.timing,
      extendedProperties: {
        private: {
          eventId: event.id
        }
      }
    }

    let response
    try {
      response = await (await this.getClient()).request({
        method: 'post',
        url: `${this.gcalBaseURL}/events`,
        data: calEvent
      })
      console.log('Event was saved', response.data)
    } catch (e) {
      console.error('There was an error saving event with gcal', e)
      throw e
    }

    if (!(response.data && response.data.id)) {
      throw new Error(`Could not save event on gcal. Event id: ${event.id}`)
    }

    return response.data.id
  }

}

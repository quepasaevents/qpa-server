import {auth} from 'google-auth-library';
import Repository from "./repository";
import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";
import { atob } from 'atob';

type GCalConfig = {
  calendarId: string
  privateKeyBase64: string
  clientEmail: string
}
export default class Calendar {
  repository: Repository
  gcalConfig: GCalConfig
  gcalBaseURL: string

  constructor(options: {
    repository: Repository,
    gcalConfig: GCalConfig,
  }) {
    this.repository = options.repository
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

  createPrimaryCalendar = async ( ) => {
    const client = await this.getClient()
    const res = await client.request({
      method: 'post',
      url: 'https://www.googleapis.com/calendar/v3/calendars',
      data: {
        summary: 'primary events calendar'
      }
    });
    console.log('res', res.data)
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

    //todo: merge events with own metadata
    return eventsResponse.data.items
  }

}
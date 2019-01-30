import Datastore from '@google-cloud/datastore'
import {CalendarEvent, User, UserKeys, UserProperties} from './types'
import {SessionInvite, Session} from './session'
import {DatastoreTransaction} from "@google-cloud/datastore/transaction";

export interface Repository {
  createUser(userProperties: UserProperties): Promise<User>
  saveSessionInvite(invite: SessionInvite)
  getSessionInvite(hash: string): Promise<SessionInvite | null>
  createSession(session: Session): Promise<Session>
  getSession(hash: string): Promise<Session>
  getUser(userKeys: UserKeys): Promise<User>
  getEvent(id: string): Promise<CalendarEvent>
  getUserById(id: string): Promise<User>
  createEvent(event: CalendarEvent): Promise<CalendarEvent>
  updateEvent(event: CalendarEvent): Promise<CalendarEvent>
}

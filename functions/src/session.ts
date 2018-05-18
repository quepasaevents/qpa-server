// Free API to get location from IP: http://freegeoip.net/json/149.11.144.50

const randomstring = require('random-string')
import {sendEmail} from './post_office'
import {domain} from './config'
import Repository from './repository'
import {DBEntity, User} from "./types";

const generateHash = () => randomstring({
  length: 48,
  letters: true,
  special: false
})

export class SessionInvite {
  hash: string
  userId: string
  timeValidated?: number

  constructor(user: User) {
    this.hash = generateHash()
    this.userId = user.id
    this.timeValidated = null
  }
}

interface BasicSessionData {
  hash: string
  userId: string
  userAgent: string
  ipAddress: Array<number>
}

export type Session = BasicSessionData & {
  ctime: number
  isValid: boolean
}

type SessionRequest = DBEntity & {
  hash: string
  email: string // todo: change this to email hash
  userAgent: string
  ipAddress: Array<number>
}

export default class SessionManager {

  repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  inviteUser = async (user: User) => {
    const invite = new SessionInvite(user)
    try {
      const persistedInvite = await this.repository.saveSessionInvite(invite)
      console.log(`Invite persisted for user ${user.username}`, persistedInvite)
    } catch (e) {
      console.error('Failed to save invite', invite)
      throw e;
    }

    try {
      await sendEmail({
        to: user.email,
        from: `signin@${domain}`,
        text: `invitation for session key: ${invite.hash}`,
        subject: 'Invitation for session'
      })
      console.log(`Sent invitation to ${user.email}`)
    } catch (e) {
      console.error('Failed to send invitation email ', invite, e)
      throw e;
    }
  }

  initiateSession = async (sessionRequest: SessionRequest): Promise<Session> => {
    const sessionInvite: SessionInvite = await this.repository.getSessionInvite(sessionRequest.hash)
    if (sessionInvite.timeValidated) {
      return Promise.reject('Session request has already been validated')
    }
    const matchingUser: User = await this.repository.getUser({
      email: sessionRequest.email
    })
    console.log('typeof matchingUser.id', typeof matchingUser.id)
    console.log('typeof sessionInvite.userId', typeof sessionInvite.userId)
    if (matchingUser.id === sessionInvite.userId) {
      const session: Session = {
        userId: matchingUser.id,
        ctime: Date.now(),
        isValid: true,
        hash: generateHash(),
        userAgent: sessionRequest.userAgent,
        ipAddress: sessionRequest.ipAddress,
      }
      const persistedSession = await this.repository.createSession(session)
      return Promise.resolve(persistedSession)
    } else {
      console.warn(`user ids didn't match. userId: ${matchingUser.id}. sessionUserId: ${sessionInvite.userId}`)
      return Promise.resolve(null)
    }
  }
}


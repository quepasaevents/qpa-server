// Free API to get location from IP: http://freegeoip.net/json/149.11.144.50

const randomstring = require('random-string')
import {sendEmail} from './post_office'
import {domain} from './config'
import { Repository } from './repository'
import {DBEntity, User} from "./types";

export class SessionAlreadyValidatedError extends Error {}

const generateHash = () => randomstring({
  length: 48,
  letters: true,
  special: false
})

export class SessionInvite implements DBEntity {
  hash: string
  userId: string
  timeValidated?: number
  id: string

  constructor(user: User) {
    this.hash = generateHash()
    this.userId = user.id
    this.timeValidated = null
  }
}

interface BasicSessionData {
  hash: string
  userId: string
}

export type Session = BasicSessionData & {
  ctime: number
  isValid: boolean
}

export type SessionRequest = DBEntity & {
  hash: string
}

export default class SessionManager {

  repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  inviteUser = async (email: string): Promise<SessionInvite> => {
    const user = await this.repository.getUser({ email });
    if (!user) {
      throw new Error('Could not find user for this email');
    }
    const invite = new SessionInvite(user)
    try {
      const persistedInvite = await this.repository.saveSessionInvite(invite)
      console.log(`Invite persisted for user ${user.username}`, persistedInvite)
    } catch (e) {
      console.error('Failed to save invite', invite)
      throw e;
    }

    return new Promise(async (resolve: (SessionInvite) => void, reject)=>{
      try {
        await sendEmail({
          to: user.email,
          from: `signin@${domain}`,
          text: `Follow this link to start a session: https://${domain}/login/${invite.hash}`,
          subject: 'Invitation for session'
        })
        resolve(invite)
        console.log(`Sent invitation to ${user.email}`)
      } catch (e) {
        reject(e)
        console.error('Failed to send invitation email ', invite, e)
        throw e
      }
    })

  }

  initiateSession = async (inviteHash: string): Promise<Session> => {
    const sessionInvite: SessionInvite = await this.repository.getSessionInvite(inviteHash)
    if (!sessionInvite) {
      throw new Error(`Could not find invite with hash ${inviteHash}`)
    }
    if (sessionInvite.timeValidated) {
      throw new SessionAlreadyValidatedError()
    }
    const matchingUser: User = await this.repository.getUserById(sessionInvite.userId)
    if (!matchingUser) {
      console.error(`Invite hash ${inviteHash} could not find related userId ${sessionInvite.userId}`)
      throw new Error('Cannot find related user to this invite')
    }
    if (matchingUser.id === sessionInvite.userId) {
      const session: Session = {
        userId: matchingUser.id,
        ctime: Date.now(),
        isValid: true,
        hash: generateHash(),
      }
      const persistedSession = await this.repository.createSession(session)
      return Promise.resolve(persistedSession)
    } else {
      console.warn(`user ids didn't match. userId: ${matchingUser.id}. sessionUserId: ${sessionInvite.userId}`)
      return Promise.resolve(null)
    }
  }

  getSession = async(sessionHash: string): Promise<Session> => {
    return await this.repository.getSession(sessionHash)
  }
}


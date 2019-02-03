// Free API to get location from IP: http://freegeoip.net/json/149.11.144.50

import {User, UserDbObject, UserSession, UserSessionDbObject} from "../@types";

const randomstring = require('random-string')
import {sendEmail} from '../post_office'
import {domain} from '../config'
import {ObjectID} from "mongodb";
import AuthRepository from "./AuthRepository";

export class SessionAlreadyValidatedError extends Error {}

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


export default class SessionManager {

  authRepository: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  inviteUser = async (email: string): Promise<SessionInvite> => {
    const user = await this.authRepository.getUser({ email });
    if (!user) {
      throw new Error('Could not find user for this email');
    }
    const { _id, ...userProps } = user;
    const invite = new SessionInvite({
      id: _id.toString(),
      ...userProps
    });

    try {
      const persistedInvite = await this.authRepository.saveSessionInvite(invite)
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

  initiateSession = async (inviteHash: string): Promise<UserSessionDbObject> => {
    const sessionInvite: SessionInvite = await this.authRepository.getSessionInvite(inviteHash)
    if (!sessionInvite) {
      throw new Error(`Could not find invite with hash ${inviteHash}`)
    }
    if (sessionInvite.timeValidated) {
      throw new SessionAlreadyValidatedError()
    }
    const matchingUser: UserDbObject = await this.authRepository.getUserById(sessionInvite.userId)
    if (!matchingUser) {
      console.error(`Invite hash ${inviteHash} could not find related userId ${sessionInvite.userId}`)
      throw new Error('Cannot find related user to this invite')
    }
    if (matchingUser._id.equals(sessionInvite.userId)) {
      const session: UserSessionDbObject = {
        user: matchingUser._id,
        ctime: Date.now(),
        isValid: true,
        hash: generateHash(),
      }
      const persistedSession = await this.authRepository.createSession(session)
      return Promise.resolve(persistedSession)
    } else {
      console.warn(`user ids didn't match. userId: ${matchingUser._id}. sessionUserId: ${sessionInvite.userId}`)
      return Promise.resolve(null)
    }
  }

  getSession = async(sessionHash: string): Promise<UserSessionDbObject> => {
    return await this.authRepository.getSession(sessionHash)
  }
}


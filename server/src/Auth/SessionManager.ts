// Free API to get location from IP: http://freegeoip.net/json/149.11.144.50

import {User} from "./User.entity"
import * as uuid from 'uuid/v4'
const randomstring = require('random-string')
import {PostOffice} from '../post_office'
import {domain} from '../config'
import {Session, SessionInvite} from "./Session.entity"

export class SessionAlreadyValidatedError extends Error {}

const generateHash = () => randomstring({
  length: 48,
  letters: true,
  special: false
})

const generateUniqueInviteHash = async () => {
  const hash = generateHash()
  const existingSession = await SessionInvite.findOne({hash: hash})
  if (existingSession) {
    return generateUniqueInviteHash()
  } else {
    return hash
  }
}
const generateUniqueSessionHash = () => {
  const hash = generateHash()
  const existingSession = Session.findOne({hash: hash})
  if (existingSession) {
    return generateUniqueInviteHash()
  } else {
    return hash
  }
}

interface Dependencies {
  sendEmail: PostOffice
}

export default class SessionManager {
  sendEmail: PostOffice

  constructor(deps: Dependencies) {
    this.sendEmail = deps.sendEmail
  }
  inviteUser = async (user: User): Promise<SessionInvite> => {
    const invite = new SessionInvite()
    invite.user = user
    invite.hash = await generateUniqueInviteHash()
    await invite.save()

    return new Promise(async (resolve: (SessionInvite) => void, reject)=>{
      try {
        await this.sendEmail({
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
    const sessionInvite: SessionInvite = await SessionInvite.findOne({hash: inviteHash})
    if (!sessionInvite) {
      throw new Error(`Could not find invite with hash ${inviteHash}`)
    }
    if (sessionInvite.timeValidated) {
      throw new SessionAlreadyValidatedError()
    }
    const session = new Session()
    session.user = sessionInvite.user
    session.isValid = true
    session.hash = generateUniqueSessionHash()
    await session.save()

    return session
  }
}


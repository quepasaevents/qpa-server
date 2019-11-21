// Free API to get location from IP: http://freegeoip.net/json/149.11.144.50

import {User} from "./User.entity"
const randomstring = require('random-string')

import {PostOffice} from '../post_office'
import {Session, SessionInvite} from "./Session.entity"

export class SessionAlreadyValidatedError extends Error {}
export class InvitationNotFoundError extends Error {}

const generateHash = () => randomstring({
  length: 48,
  letters: true,
  special: false
})

const generateUniqueInviteHash = async () => {
  const hash = generateHash()
  const existingSession = await SessionInvite.findOne({hash: hash})
  if (existingSession) {
    return await generateUniqueInviteHash()
  } else {
    return hash
  }
}
const generateUniqueSessionHash = async () => {
  const hash = generateHash()
  const existingSession = await Session.findOne({hash: hash})
  if (existingSession) {
    return generateUniqueInviteHash()
  } else {
    return hash
  }
}

interface Dependencies {
  sendEmail: PostOffice
  emailTargetDomain: string
  emailSenderDomain: string
}

export default class SessionManager {
  sendEmail: PostOffice
  emailTargetDomain: string
  emailSenderDomain: string

  constructor(deps: Dependencies) {
    this.sendEmail = deps.sendEmail
    this.emailTargetDomain = deps.emailTargetDomain
    this.emailSenderDomain = deps.emailSenderDomain
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
          from: `signin@${this.emailTargetDomain}`,
          text: `Follow this link to start a session: http://${this.emailTargetDomain}/init-session/${invite.hash}`,
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
    const sessionInvite: SessionInvite = await SessionInvite.findOne({hash: inviteHash}, {
      relations: ['user']
    })
    if (!sessionInvite) {
      throw new InvitationNotFoundError(`Could not find invite with hash ${inviteHash}`)
    }
    if (sessionInvite.timeValidated) {
      throw new SessionAlreadyValidatedError()
    }
    await sessionInvite.user
    const session = new Session()
    session.user = sessionInvite.user
    session.isValid = true
    session.hash = await generateUniqueSessionHash()
    await session.save()

    // sessionInvite.timeValidated = new Date()
    // await sessionInvite.save()

    return session
  }
}


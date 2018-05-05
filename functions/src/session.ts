// Free API to get location from IP: http://freegeoip.net/json/149.11.144.50
const randomstring = require('random-string')
import {sendEmail} from './post_office'
import {domain} from './config'
import Repository from './repository'
import {User} from "./types";

export class SessionInvite {

  oneTimeKey: string
  userId: string

  constructor(user: User) {
    this.oneTimeKey = randomstring({
      length: 24,
      letters: true,
      special: false
    })
    this.userId = user.id
  }
}

export default class SessionManager {

    repository: Repository

    constructor(repository: Repository){
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
        const sentMail = await sendEmail({
          to: user.email,
          from: `signin@${domain}`,
          text: `invitation for session key: ${invite.oneTimeKey}`,
          subject: 'Invitation for session'
        })
        console.log(`Sent invitation to ${user.email}`)
      } catch (e) {
        console.error('Failed to send invitation email', invite)
        throw e;
      }
    }
}


// Free API to get location from IP: http://freegeoip.net/json/149.11.144.50
import randomstring from 'randomstring'

import { sendEmail } from './post_office'
import { domain } from './config'
import repository from './repository'
import {SessionInvite, User} from "./types";

const newInvite = (user: User): SessionInvite => {
  return {
    oneTimeKey: randomstring.generate({
      length: 24,
      charset: 'alphabetic'
    }),
    userId: user.id
  }
};

export const inviteUser = async (user: User) => {
  const invite = newInvite(user)
  try {
    await repository.saveSessionInvite(invite)
  } catch (e) {
    console.error('Failed to save invite', invite)
    throw e;
  }

  try {
    await sendEmail({
      to: user.email,
      from: `signin@${domain}`,
      text: `invitation for session key: ${invite.oneTimeKey}`,
      subject: 'Invitation for session'
    })
  } catch (e) {
    console.error('Failed to send invitation email', invite)
    throw e;
  }
}


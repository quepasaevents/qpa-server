import { mailgun as mailgunConfig } from './config'
const Mailgun = require('mailgun-js')

interface Email {
  from: string
  to: string
  subject: string
  text: string
}

export type PostOffice = (email: Email) => Promise<boolean>

export const sendEmail: PostOffice = async (email: Email) => {
  console.log('Will try to send following email', JSON.stringify(email))
  return new Promise((resolve, reject) => {
    try {
      const client = Mailgun(mailgunConfig)
      client.messages().send(email, function (error, body) {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    } catch (e) {
      console.error('Failed to send mail', e)
      reject(e)
    }

  })
}

import { mailgun as mailgunConfig } from './config';

const client = require('mailgun-js')(mailgunConfig);

interface Email {
  from: string
  to: string
  subject: string
  text: string
}

export const sendEmail = async (email: Email) => {
  console.log('Will try to send following email', JSON.stringify(email))
  return new Promise((resolve, reject) => {
    try {
      client.messages().send(email, function (error, body) {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      });
    } catch (e) {
      console.error('Failed to send mail', e)
      reject(e)
    }

  })
}
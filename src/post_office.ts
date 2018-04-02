import mailgun from 'mailgun-js';
import {mailgun as mailgunConfig} from './config';

const client = mailgun(mailgunConfig);

interface Email {
  from: string
  to: string
  subject: string
  text: string
}

export const sendEmail = async (email: Email) => {
  return new Promise((resolve, reject) => {
    mailgun.messages().send(email, function (error, body) {
      if (error) {
        reject(error)
      } else {
        resolve(body)
      }
    });

  })
}
import * as functions from 'firebase-functions';
import {
  isUserAvailable as isUserAvailableHandler,
  signup as signupHandler,
  signin as signinHandler
} from './userHandlers'

import {
  events as eventsHandler,
} from './calendarHandlers';

const IS_FIREBASE = true;

const httpHandler = (func) => {
  let result = func
  if (IS_FIREBASE) {
    result = functions.https.onRequest(func)
  }
  return result
}

const isUserAvailable = httpHandler(isUserAvailableHandler)
const signup = httpHandler(signupHandler)
const signin = httpHandler(signinHandler)

export {
  isUserAvailable,
  signup,
  signin
}


const events = httpHandler(eventsHandler)

export {
  events
}
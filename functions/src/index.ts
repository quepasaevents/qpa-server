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

export const isUserAvailable = httpHandler(isUserAvailableHandler)
export const signup = httpHandler(signupHandler)
export const signin = httpHandler(signinHandler)
export const events = httpHandler(eventsHandler)

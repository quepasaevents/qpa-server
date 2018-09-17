import * as functions from 'firebase-functions';
import {
  isUserAvailable as isUserAvailableHandler,
  signup as signupHandler,
  signin as signinHandler,
  setDependencies as setUserHandlerDependencies,
  postSession as postSessionHandler,
} from './userHandlers'

import {
  events as eventsHandler,
  setDependencies as setEventsHandlerDependencies
} from './eventHandlers';
import {gcal as gcalConfig, projectId} from './config'
import UserManager from "./user";
import SessionManager from "./session";
import Repository from "./repository";
import Calendar from "./calendar";
import EventManager from "./event";

const IS_FIREBASE = true;

const repository = new Repository(projectId)
const userManager = new UserManager(repository)
const sessionManager = new SessionManager(repository)
const calendarManager = new Calendar({
  repository,
  gcalConfig: gcalConfig
})
const eventManager = new EventManager(calendarManager, repository)

setUserHandlerDependencies({
  userManager, sessionManager
})
setEventsHandlerDependencies({
  sessionManager, calendarManager, eventManager
})

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
export const postSession = httpHandler(postSessionHandler)

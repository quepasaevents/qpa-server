import express from 'express';

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

console.log('cc service exiting')

const app = express();

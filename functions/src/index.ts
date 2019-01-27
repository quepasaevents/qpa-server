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
import MongoRepository from './mongorepo'
import Calendar from "./calendar";
import EventManager from "./event";
import GraphQLInterface from "./graphql";

async function start() {
  const repository = new MongoRepository(projectId)
  await repository.connect()

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

  const gql = new GraphQLInterface({
    repository,
    userManager,
    sessionManager,
    calendarManager,
    eventManager,
  });

  gql.start()

}

start()

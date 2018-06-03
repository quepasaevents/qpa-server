import {Request, Response} from "express";
import CalendarManager from './calendar';
import SessionManager from "./session";
import {AuthenticatedRequest, authRequest} from "./authRequest";
import {CalendarEvent} from "./types";
import EventManager from "./event";

let sessionManager: SessionManager, calendarManager: CalendarManager, eventManager: EventManager
export type Dependencies = {
  sessionManager: SessionManager
  calendarManager: CalendarManager,
  eventManager: EventManager,
}

export const setDependencies = (dependencies: Dependencies) => {
  sessionManager = dependencies.sessionManager
  calendarManager = dependencies.calendarManager
  eventManager = dependencies.eventManager
}

export const getEvents = async (req: Request, res: Response) => {
  let result
  try {
    result = await calendarManager.listEvents()
  } catch (e) {
    console.log('Caught error while listing events', e)
    res.status(500)
    res.send('Error fetching events')
  }
  res.send(result)
  res.status(200)
}

export const postEvent = async (req: Request, res: Response) => {
  await authRequest(sessionManager)(req, res)
  const session = (req as AuthenticatedRequest).session
  if (session.isValid) {
    res.status(200)
    res.send(`Session for user id: ${session.userId}`)
  } else {
    res.sendStatus(403)
  }

  const eventData = req.body as CalendarEvent
  eventData.owner = session.userId
  const event = await eventManager.createEvent(eventData)
}

export const events = async (req: Request, res: Response) => {
  let delegationHandler
  if (req.method === 'GET') {
    delegationHandler = getEvents
  } else if (req.method === 'POST') {
    delegationHandler = postEvent
  } else {
    res.sendStatus(400)
    return
  }
  delegationHandler(req, res)
}


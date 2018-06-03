import {Request, Response} from "express";
import CalendarManager from './calendar';
import Repository from "./repository";
import * as cookie from 'cookie'
import SessionManager, {Session} from "./session";
import UserManager from "./user";


let sessionManager, calendarManager
export type Dependencies = {
  repository: Repository,
  userManager: UserManager,
  sessionManager: SessionManager
  calendarManager: CalendarManager,
}

export const setDependencies = (dependencies: Dependencies) => {
  sessionManager = dependencies.sessionManager
  calendarManager = dependencies.calendarManager
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
  // const eventData: CalendarEvent = req.body;
  let sessionHash, session: Session
  try {
    sessionHash = cookie.parse(req.headers.cookie).__session
    session = await sessionManager.getSession(sessionHash)
    if (!sessionHash) {
      throw new Error('Session cookie required')
    }
  } catch (e) {
    console.log('Exception getting session', e)
    res.status(401)
    res.send('Authentication required to post an event')
    return
  }
  console.log('sessionId', session.userId)
  res.status(200)
  res.send(`sessionId: ${sessionHash}`)
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


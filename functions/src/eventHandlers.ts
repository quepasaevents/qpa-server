import {Request, Response} from "express";
import Calendar from './calendar';
import {projectId, gcal as gcalConfig} from './config'
import Repository from "./repository";
// import {CalendarEvent} from "./types";
import * as cookie from 'cookie'

const calendar = new Calendar({
  repository: new Repository(projectId),
  gcalConfig: gcalConfig
})

export const getEvents = async (req: Request, res: Response) => {
  let result
  try {
    result = await calendar.listEvents()
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
  let sessionId
  try {
    sessionId = cookie.parse(req.headers.cookie).__session
    if(!sessionId) {
      throw new Error('Session cookie required')
    }
  } catch (e) {
    res.status(401)
    res.send('Authentication required to post an event')
    return
  }
  console.log('sessionId', sessionId)
  res.status(200)
  res.send(`sessionId: ${sessionId}`)
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


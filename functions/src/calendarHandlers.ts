import {Request, Response} from "express";
import Calendar from './calendar';
import {projectId, gcal as gcalConfig} from './config'
import Repository from "./repository";

const calendar = new Calendar({
  repository: new Repository(projectId),
  gcalConfig: gcalConfig
})

export const events = async (req: Request, res: Response) => {
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
  const {} = req.body;
}
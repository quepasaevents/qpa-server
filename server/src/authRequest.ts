import SessionManager, {Session} from "./session";
import {Request, Response} from 'express';
import * as cookie from 'cookie'

export type AuthenticatedRequest = Request & {
  session: Session
}
export const authRequest = (sessionManager: SessionManager) => async (req: Request, res: Response) => {
  // const eventData: CalendarEvent = req.body;
  let sessionHash, session: Session
  try {
    const cookiesHeader = req.headers.cookie
    console.log('allHeaders', req.headers)
    console.log('cookiesHeader', cookiesHeader)
    sessionHash = cookie.parse(req.headers.cookie).__session
    if (!sessionHash) {
      throw new Error('Session cookie required')
    }
    session = await sessionManager.getSession(sessionHash)
  } catch (e) {
    console.log('Exception getting session', e)
    res.status(401)
    res.send('Authentication required to post an event')
    return
  }

  if (!session || !session.isValid) {
    res.status(401)
    res.send('Could not find active session. Please log in.')
    return
  }

  (req as AuthenticatedRequest).session = session
}
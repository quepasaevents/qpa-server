import {User} from "./User.entity"
import SessionManager, {InvitationNotFoundError, SessionAlreadyValidatedError} from "./SessionManager"
import {Request} from "express-serve-static-core"
import {Session} from "./Session.entity";

const authHttpHandlers = (sessionManager: SessionManager) => ({
  loginHandler: async function (req: Request, res) {
    const body = req.body
    console.log('body', body)

    const user = await User.findOne({ email: req.body.email })

    if (user) {
      sessionManager.inviteUser(user)
      res.statusCode = '200'
      res.send('invitation sent')
    } if (!user) {
      res.statusCode = '404'
      res.send('email not found')
    }
  },

  initializeSessionHandler: async function (req: Request, res) {
    const hash = req.body && req.body.hash
    if (!hash) {
      res.statusCode = 400
      res.send('Hash is missing')
    }
    let session: Session
    try {
      session = await sessionManager.initiateSession(hash)
    } catch (e) {
      if (e instanceof SessionAlreadyValidatedError) {
        res.statusCode = 401
        res.send('Session already validated')
      } else if (e instanceof InvitationNotFoundError) {
        res.statusCode = 404
        res.send('Could not find invitation with provided hash')
      }
      return
    }

    if (!session) {
      throw new Error('Session is null')
    }

    console.log('Found session with hash', session.hash)
    res.setHeader('set-cookie', `authentication=${session.hash};Path=/;HttpOnly`)

    res.send('alright')
  }
})

export default authHttpHandlers

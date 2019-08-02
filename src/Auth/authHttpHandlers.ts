import {User} from "./User.entity"
import SessionManager, {InvitationNotFoundError, SessionAlreadyValidatedError} from "./SessionManager"
import {Request, Response} from "express-serve-static-core"
import {Session, SessionInvite} from "./Session.entity"

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
  },

  signupHandler: async (req: Request, res: Response) => {
    const { name, email } = req.body
    if (!(name && email)) {
      res.status(400)
      res.send('must provide email and name')
      return
    }
    const existingUser = await User.findOne({email})
    if (existingUser) {
      res.status(409)
      res.send('email taken')
      return
    }

    const user = new User()
    user.email = email
    user.name = name
    user.save()

    const invitataion = sessionManager.inviteUser(user)

  },

  signoutHandler: async (req: Request, res: Response) => {
    const hash = req.header('cookie').match(/.*authentication=(\w+)/)[1]
    res.clearCookie('authentication')
    const session = await Session.findOne({hash})
    session.isValid = false
    await session.save()

    res.status(200)
    res.send('You have been signed out successfully')
    return res

  }
})

export default authHttpHandlers

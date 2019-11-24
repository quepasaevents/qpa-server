import {User} from "./User.entity"
import SessionManager, {InvitationNotFoundError, SessionAlreadyValidatedError} from "./SessionManager"
import {Request, Response} from "express-serve-static-core"
import {Session, SessionInvite} from "./Session.entity"

const authHttpHandlers = (sessionManager: SessionManager) => ({
  loginHandler: async function (req: Request, res) {
    if (!req.body?.email) {
      res.statusCode = '400'
      res.send('Must provide email address')
      return
    }
    const normalizedEmail = req.body.email.toLowerCase()

    const user = await User.findOne({email: normalizedEmail})

    if (user) {
      sessionManager.inviteUser(user)
      res.statusCode = '200'
      res.send('invitation sent')
    }
    if (!user) {
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
    res.setHeader('set-cookie', `authentication=${session.hash};Path=/;HttpOnly;Max-Age=2628000;Secure`)

    res.send('alright')
  },

  signupHandler: async (req: Request, res: Response) => {
    const {name, email: rawEmail} = req.body
    if (!(name && rawEmail)) {
      res.status(400)
      res.send('must provide email and name')
      return
    }
    const normalizedEmail = rawEmail.toLowerCase()

    const existingEmailUser = await User.findOne({email: normalizedEmail})
    if (existingEmailUser) {
      res.status(409)
      res.send('email taken')
      return
    }

    const user = new User()
    user.email = normalizedEmail
    user.name = name

    try {
      await user.save()
      res.status(200)
      res.send('User created. An invite will be sent soon per email')
    } catch (e) {
      res.status(500)
      console.log(`Error saving user ${e.message}`)
      res.send('Error saving user')
      return
    }

    const invitation = await sessionManager.inviteUser(user)
    console.log(`Invitation sent. userId: ${invitation.user.id}`)

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

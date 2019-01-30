import {parse} from 'url'
import UserManager from './user'
import {Request, Response} from 'express'
import SessionManager, {Session, SessionAlreadyValidatedError, SessionRequest} from './session'
import {UserProperties} from './types'

let userManager, sessionManager
export type Dependencies = {
  userManager: UserManager,
  sessionManager: SessionManager
}

export const setDependencies = (dependencies) => {
  userManager = dependencies.userManager
  sessionManager = dependencies.sessionManager
}

export const isUserAvailable = async (req: Request, res: Response) => {
  const params = parse(req.url, true).query

  const user = await userManager.getUser({
    email: params.email as string,
    username: params.username as string
  })

  res.send({
    exists: !!user
  });

  return true
}

const handleSignup = (async (req: Request, res: Response) => {
  const {username, email, firstName, lastName} = req.body
  const userProperties: UserProperties = {username, email, firstName, lastName}

  let newUser
  const userKeys = {
    username, email, name
  }
  try {
    console.log(`Will try to create new user ${userKeys}`)
    newUser = await userManager.createUser(userKeys)
  } catch (e) {
    console.error('Error creating new user', userKeys, e)
    res.status(409)
    res.send(e.message)
    return
  }

  if (!newUser) {
    res.status(409)
    res.send(`Could not create user: ${JSON.stringify(userProperties)}`)
    return
  }

  console.log('User created', JSON.stringify(newUser))
  res.status(200)
  res.send('User created. Invitation will be sent.')

  try {
    await sessionManager.inviteUser(newUser)
  } catch (e) {
    res.status(500)
    res.send(`Error sending invitation. ${e.message}`)
    console.error('Error sending invitation', e)
  }

})

export const signup = async (req: Request, res: Response) => {
  try {
    await handleSignup(req, res)
  } catch (e) {
    console.error('Signup handle error', e)
    res.send('Signup handle error')
    throw e
  }
}

const handleSignin = async (req: Request, res: Response) => {
  const params = req.body
  const ip = req.ip.split('.').map(num => parseInt(num))

  console.log('Got sign in request with params', JSON.stringify(params))
  let session = null
  try {

  session = await sessionManager.initiateSession({
    hash: params.hash as string,
    ipAddress: ip,
    userAgent: req.headers['user-agent'],
  } as SessionRequest)
  } catch (e) {
    if (e instanceof SessionAlreadyValidatedError) {
      res.status(401)
      res.send('Session already validated')
      return
    }
  }

  if (!session) {
    res.status(403)
    res.send('Could not initiate session with the given data')
    return
  }

  console.log('Session initiated', JSON.stringify(session))
  res.status(200)
  res.setHeader('set-cookie', `__session=${session.hash}; Secure;`)
  res.send(`Session initiated: ${JSON.stringify(session)}`)
}

export const signin = async (req: Request, res: Response) => {
  try {
    console.log('Will handle signin request')
    await handleSignin(req, res)
  } catch (e) {
    console.error('Sign-in handle error', e)
    res.send('Sign-in handle error')
    res.status(500)
    throw e
  }
}

const handlePostSession = async (req: Request, res: Response) => {
  const { email } = req.body

  console.log('Will request new session for email: ', email)
  const user = await userManager.getUser({email})
  if (!user) {
    res.status(404)
    res.send('Could not find user')
    return
  }
  await sessionManager.inviteUser(user)
  res.status(200)
  res.send('Invitation sent to email')
}

export const postSession = async (req: Request, res: Response) => {
  try {
    await handlePostSession(req, res)
  } catch (e) {
    console.error('Error in request new session for existing user', e)
    res.send('Request session error')
    res.status(500)
    throw e
  }
}

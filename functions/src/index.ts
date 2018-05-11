import {parse} from 'url'
import UserManager from './user'
import {Request, Response} from 'express'
import SessionManager from './session'
import Repository from './repository'
import {projectId} from './config'
import {UserProperties} from "./types";

const repository = new Repository(projectId)
const userManager = new UserManager(repository)
const sessionManager = new SessionManager(repository)

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

const handleSignup = async (req: Request, res: Response) => {
  const {username, email, name} = req.body
  console.log('typeof req.body', typeof req.body)
  console.log('req.body', req.body)
  const userProperties: UserProperties = {username, email, name}

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
    console.error('Error sending invitation', e)
  }

}


export const signup = async (req: Request, res: Response) => {
  try {
    handleSignup(req, res)
  } catch (e) {
    console.error('Signup handle error', e)
    res.send('Signup handle error')
    throw e
  }
}

const handleSignin = async (req: Request, res: Response) => {
  const params = parse(req.url, true).query
  console.log('Got sign in request with params', JSON.stringify(params))
  sessionManager
}

export const signin = async (req: Request, res: Response) => {
  try {
    handleSignin(req, res)
  } catch (e) {
    console.error('Sign-in handle error', e)
    res.send('Sign-in handle error')
    res.status(500)
    throw e
  }
}

export const requestSessionInvite = async (req, res) => {

}

export const startSession = async (req, res) => {

}
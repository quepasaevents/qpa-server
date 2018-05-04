import {parse} from 'url'
import UserManager from './user'
import { Request, Response } from 'express'
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

export const signup = async (req: Request, res: Response) => {
  const {username, email, name} = req.body
  console.log('typeof req.body', typeof req.body)
  console.log('req.body', req.body)
  const userProperties: UserProperties = {username, email, name}

  let newUser
  try {
    newUser = await userManager.createUser({
      username, email, name
    })
  } catch (e) {
    res.status(409)
    res.send(e.message)
    return
  }

  if (newUser) {
    res.status(200)
    res.write('User created. Invitation will be sent.')
    sessionManager.inviteUser(newUser)
  } else {
    res.status(409)
    res.send(`Could not create user: ${JSON.stringify(userProperties)}`)
    return
  }
}

export const requestSessionInvite = async (req, res) => {

}

export const startSession = async (req, res) => {

}
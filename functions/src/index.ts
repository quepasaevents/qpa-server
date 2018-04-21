import {parse} from 'url'
import {getUser, createUser} from './user'
import { Request, Response } from 'express'
import { inviteUser } from './session'

export const isUserAvailable = async (req: Request, res: Response) => {
  const params = parse(req.url, true).query

  const user = await getUser({
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
  console.log('Signup request', {username, email, name})
  let newUser
  try {
    newUser = await createUser({
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
    inviteUser(newUser)
  } else {
    res.status(409)
    res.send('Could not create user')
    return
  }
}

export const requestSessionInvite = async (req, res) => {

}

export const startSession = async (req, res) => {

}
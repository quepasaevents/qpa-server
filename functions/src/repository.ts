import * as Datastore from '@google-cloud/datastore'
import {User, UserKeys, UserProperties} from './types'
import {SessionInvite} from './session'

export default class Repository {

  datastore: Datastore

  constructor(projectId: string) {
    this.datastore = new Datastore({
      projectId,
    });
  }

  async createUser(userProperties: UserProperties): Promise<User> {
    console.log(`Will try to create use with properties: ${JSON.stringify(userProperties)}`)
    const entity = {
      key: this.datastore.key(['user']),
      data: userProperties
    }

    return new Promise((resolve, reject) => {
      return this.datastore.save(entity, err => {
        if (err) {
          console.log(`Error creating user with properties: ${JSON.stringify(userProperties)}`)
          reject(err)
        } else {
          console.log(`Successfully created user ${userProperties.username}. Will try to fetch now.`)
          this.getUser({
            username: userProperties.username,
          }).then(resolve)
            .catch(e => {
              console.error(`Error with fetch confirmation for new user ${userProperties.username}`)
            })
        }
      })
    })
  }

  async saveSessionInvite(invite: SessionInvite) {
    const entity = {
      key: this.datastore.key(['SessionInvite']),
      data: invite
    }
    return this.datastore.save(entity)
  }

  async getUser(user: UserKeys): Promise<User> {
    let query = this.datastore
      .createQuery('user')

    if (user.email) {
      query = query.filter('email', '=', user.email)
    }
    if (user.username) {
      query = query.filter('username', '=', user.username)
    }
    const resultPromise = new Promise((resolve, reject) => {
      this.datastore.runQuery(query, (err, resultSet: Array<User>) => {
          console.log('Result Set:', JSON.stringify(resultSet[0]), JSON.stringify(resultSet[1]))
          if (err) {
            reject(err)
          } else {
            if (resultSet.length > 1) {
              const message = `Got more than one user, should have gotten at most one: ${JSON.stringify(resultSet)}`
              console.error(message)
              reject(new Error(message))
            }
            const userData = resultSet.length ? resultSet[0] : null
            const result: User = userData as User
            resolve(result)
          }
        }
      )
    })
    return resultPromise
  }
}
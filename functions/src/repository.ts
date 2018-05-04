import * as Datastore from '@google-cloud/datastore'
import {SessionInvite, User, UserKeys, UserProperties} from './types'
import {projectId} from './config'

export default class Repository {

  datastore: Datastore

  constructor() {
    this.datastore = new Datastore({
      projectId: projectId,
    });
  }

  async createUser(userProperties: UserProperties): Promise<User> {
    const entity = {
      key: this.datastore.key(['user']),
      data: userProperties
    }

    return new Promise((resolve, reject) => {
      return this.datastore.save(entity, err => {
        if (err) {
          reject(err)

        } else {
          this.getUser({
            username: userProperties.username,
          }).then(resolve)

        }
      })
    })
  }

  async saveSessionInvite(invite: SessionInvite) {
    const entity = {
      key: this.datastore.key(['SessionInvite']),
      data: invite
    }
    return await this.datastore.save(entity)
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
    return new Promise((resolve, reject) => {
      this.datastore.runQuery(query, (err, resultSet: Array<User>) => {
        console.log('Result Set:', JSON.stringify(resultSet))
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
  }
}
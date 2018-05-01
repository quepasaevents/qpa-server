const Datastore = require('@google-cloud/datastore')
import {SessionInvite, User, UserKeys, UserProperties} from './types'
import {projectId} from './config'

const datastore = Datastore({
  projectId: projectId,
});

export default class Repository {

  async createUser(userProperties: UserProperties): Promise<User> {
    const entity = {
      key: datastore.key('user'),
      data: userProperties
    }

    return new Promise((resolve, reject) => {
      return datastore.save(entity, err => {
        if (err) {
          reject(err)
        } else {
          const user = await this.getUser({
            username: userProperties.username,
          })
          resolve(user as User)
        }
      })
    })
  }

  static async saveSessionInvite(invite: SessionInvite) {
    const entity = {
      key: datastore.key('SessionInvite'),
      data: invite
    }
    return await datastore.save(entity)
  }

  static async getUser(user: UserKeys): Promise<User> {
    let query = datastore
      .createQuery('user')

    if (user.email) {
      query = query.filter('email', '=', user.email)
    }
    if (user.username) {
      query = query.filter('username', '=', user.username)
    }

    return new Promise((resolve, reject) => {
      datastore.runQuery(query, (err, entities) => {
        if (err) {
          reject(err)
        } else {
          const resultSet = entities[0]
          if (resultSet.length > 1) {
            console.warn('Got more than one user, should have gotten at most one', JSON.stringify(resultSet))
          }
          const result: User = resultSet.length ? resultSet[0] : null
          resolve(result)
        }
      })
    })
  };
}
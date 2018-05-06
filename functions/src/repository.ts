import * as Datastore from '@google-cloud/datastore'
import {User, UserKeys, UserProperties} from './types'
import {SessionInvite} from './session'
import {DatastoreTransaction} from "@google-cloud/datastore/transaction";

export default class Repository {

  datastore: Datastore

  constructor(projectId: string) {
    this.datastore = new Datastore({
      projectId,
    });
  }

  async createUser(userProperties: UserProperties): Promise<User> {
    if (!(userProperties.username && userProperties.email)) {
      const message = `Cannot create user without username and email: ${userProperties}`
      console.error(message)
      return Promise.reject(new Error(message))
    }

    console.log(`Will try to create use with properties: ${JSON.stringify(userProperties)}`)
    const entityToSave = {
      key: this.datastore.key(['user']),
      data: userProperties
    }

    return new Promise(async (resolve, reject) => {
      const tx: DatastoreTransaction = await this.datastore.transaction()
      await tx.run()
      let query = tx.createQuery('user')

      if (userProperties.email) {
        query = query.filter('email', '=', userProperties.email)
      }
      if (userProperties.username) {
        query = query.filter('username', '=', userProperties.username)
      }

      tx.runQuery(query, async (err, entities: Array<User>) => {
        if (err) {
          console.error('Error confirming existence of user before saving', err)
          reject(err)
        } else if (entities) {
          console.warn('Refusing to save user since it already exists')
          reject(new Error(`Refusing to save user since it already exists ${userProperties}`))
        } else {
          await tx.save(entityToSave)
          await tx.commit()
          resolve(await this.getUser(userProperties))
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
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
      const message = `Cannot create user without username and email: ${JSON.stringify(userProperties)}`
      console.error(message)
      return Promise.reject(new Error(message))
    }

    return new Promise(async (resolve, reject) => {
      const tx: DatastoreTransaction = await this.datastore.transaction()
      await tx.run()

      for (let key in ['username', 'email']) {
        const userWithKey = await this.getUser({
          [key]: userProperties[key]
        }, tx)
        if (userWithKey) {
          reject(new Error(`Error creating new user: ${key} ${userWithKey[key]} already exists.`))
          return
        }

      }

      console.log(`Will try to create user with properties: ${JSON.stringify(userProperties)}`)
      const entityToSave = {
        key: this.datastore.key(['user']),
        data: userProperties
      }

      await tx.save(entityToSave)
      await tx.commit()
      resolve(await this.getUser(userProperties))
    })
  }

  async saveSessionInvite(invite: SessionInvite) {
    console.log('Will try and save session invite', invite)
    const entity = {
      key: this.datastore.key(['session_invite']),
      data: invite
    }
    return this.datastore.save(entity)
  }

  async getUser(user: UserKeys, datastore?: Datastore | DatastoreTransaction): Promise<User> {
    const ds = (datastore || this.datastore)
    let query = ds.createQuery('user')
    if (user.email) {
      query = query.filter('email', '=', user.email)
    }
    if (user.username) {
      query = query.filter('username', '=', user.username)
    }
    const resultPromise = new Promise((resolve, reject) => {
      ds.runQuery(query, (err, resultSet: Array<User>) => {
          console.log('Result Set:', JSON.stringify(resultSet))
          if (!resultSet) {
            resolve(null)
          } else if (err) {
            reject(err)
          } else if (resultSet.length > 1) {
            const message = `Got more than one user, should have gotten at most one: ${JSON.stringify(resultSet)}`
            console.error(message)
            reject(new Error(message))
          } else {
            const userData = resultSet.length ? resultSet[0] : null
            const result: User = {
              ...userData,
              id: userData[Datastore.KEY].id
            } as User
            resolve(result)
          }
        }
      )
    })
    return resultPromise
  }
}
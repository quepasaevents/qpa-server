import * as Datastore from '@google-cloud/datastore'
import {User, UserKeys, UserProperties} from './types'
import {SessionInvite, Session} from './session'
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

      const getUserRequests = ['username', 'email'].map(key => this.getUser({
        [key]: userProperties[key]
      }, tx))

      const usersWithRequestedKeys = await Promise.all(getUserRequests)
      const anyExistingUsersFound = usersWithRequestedKeys.filter(Boolean)

      if (anyExistingUsersFound.length > 0) {
        await tx.rollback()
        const message = `Error creating new user: already exists. ${JSON.stringify(anyExistingUsersFound)}`
        reject(new Error(message))
        return
      }

      console.log(`Will try to create user with properties: ${JSON.stringify(userProperties)}`)
      const entityToSave = {
        key: this.datastore.key(['User']),
        data: userProperties
      }

      tx.save(entityToSave)
      await tx.commit()

      resolve(await this.getUser(userProperties))
    })
  }

  async saveSessionInvite(invite: SessionInvite) {
    console.log('Will try and save session invite', invite)
    const entity = {
      key: this.datastore.key(['SessionInvite']),
      data: invite
    }
    return this.datastore.save(entity)
  }

  async getSessionInvite(hash: string, datastore ?: Datastore | DatastoreTransaction): Promise<SessionInvite | null> {
    const ds = (datastore || this.datastore)
    const query = ds.createQuery('SessionInvite')
      .filter('hash', hash)
    return new Promise((resolve: (SessionInvite) => void, reject) => {
      ds.runQuery(query, (err, resultSet: Array<SessionInvite>) => {
        if (err) {
          reject(err)
        } else if (!resultSet) {
          console.log('Could not find any session for hash', hash)
          resolve(null)
        } else if (resultSet.length > 1) {
          const message = `Got more than two invited for hash ${hash}`
          console.warn(`Got more than two invited for hash ${hash}`)
          reject(new Error(message))
        } else {
          console.log(`Found invitation, ${resultSet[0]}`)
          resolve(resultSet[0])
        }
      })
    })
  }

  async createSession(session: Session): Promise<Session> {
    console.log(`Will try to save session ${JSON.stringify(session)}`)
    await
      this.datastore.save({
        key: this.datastore.key(['Session']),
        data: session
      })
    const query = this.datastore.createQuery('Session')
      .filter('hash', session.hash)
      .filter('userId', session.userId)
    return new Promise((resolve: (Session) => void, reject) => {
      this.datastore.runQuery(query, (err, resultSet: Array<Session>) => {
        if (err) {
          reject(err)
        } else if (!resultSet) {
          resolve(null)
        } else if (resultSet.length > 1) {
          const message = `Got more than one session with the same user id: ${session.userId}`
          reject(message)
        } else {
          resolve(resultSet[0])
        }
      })
    })
  }

  async getSession(hash: string): Promise<Session> {
    const query = this.datastore.createQuery('Session')
      .filter('hash', hash)
    return new Promise((resolve: (Session) => void, reject) => {
      this.datastore.runQuery((query), (err, resultSet: Array<Session>) => {
        if (err) {
          reject(err)
        } else if (!resultSet) {
          resolve(null)
        } else if (resultSet.length >1) {
          const message = `Got more than one session with the same hash`
          reject(message)
        } else {
          resolve(resultSet[0])
        }
      })
    })
  }

  async getUser(userKeys: UserKeys, datastore ?: Datastore | DatastoreTransaction): Promise<User> {
    const ds = (datastore || this.datastore)
    let query = ds.createQuery('User')
    if (userKeys.email) {
      query = query.filter('email', '=', userKeys.email)
    }
    if (userKeys.username) {
      query = query.filter('username', '=', userKeys.username)
    }
    return new Promise((resolve: (User) => void, reject) => {
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
            const result: User = userData && {
              ...userData,
              id: userData[Datastore.KEY].id
            } as User
            resolve(result)
          }
        }
      )
    })
  }
}
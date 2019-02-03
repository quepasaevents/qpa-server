import Repository, {transformId, OIDable, Collections} from "../repository";
import {SessionInvite} from "./SessionManager";
import {Collection, ObjectID} from "mongodb";
import {SignupInput, User, UserDbObject, UserSession, UserSessionDbObject} from "../@types";

interface UserKeys {
  username?: string
  email?: string
}

type Insertable<T> = T & {
  _id?: ObjectID
}

interface AuthCollections {
  users: Collection<UserDbObject>,
  sessions: Collection<UserSessionDbObject>,
  sessionInvites: Collection<SessionInvite>
}

class AuthRepository {
  repository: Repository
  c: AuthCollections

  constructor({repository}) {
    this.repository = repository
    this.c = {
      users: this.repository.db.collection<UserDbObject>('users'),
      sessions: this.repository.db.collection<UserSessionDbObject>('sessions'),
      sessionInvites: this.repository.db.collection<SessionInvite>('session_invites'),
    }
  }

  async createUser(userProperties: SignupInput): Promise<UserDbObject> {
    if (!(userProperties.username && userProperties.email)) {
      const message = `Cannot create user without username and email: ${JSON.stringify(userProperties)}`
      console.error(message)
      return Promise.reject(new Error(message))
    }
    const dbSession = await this.repository.client.startSession()
    dbSession.startTransaction()
    let excpetionToThrowBack: Error | null = null

    try {
      const existingUser = await this.c.users.findOne({
        $or: [
          {email: userProperties.email},
          {username: userProperties.username}
        ]
      })

      if (existingUser) {
        await dbSession.abortTransaction()
        const message = 'Error creating new user: already exists'
        excpetionToThrowBack = new Error(message)
        throw excpetionToThrowBack
      }

      const insertResult = await this.c.users.insertOne(userProperties as UserDbObject)

      if (insertResult.result.ok !== 1) {
        await dbSession.abortTransaction()
        excpetionToThrowBack = new Error(`Error inserting user ${userProperties}`)
      } else {
        await dbSession.commitTransaction()
      }
    } finally {
      if (dbSession.inTransaction()) {
        dbSession.abortTransaction()
      }
    }

    if (excpetionToThrowBack) {
      throw excpetionToThrowBack
    }

    return this.c.users.findOne({username: userProperties.username, email: userProperties.email})
  }

  async saveSessionInvite(invite: SessionInvite) {
    const result = await this.c.sessionInvites.insertOne(invite)
    if (result.result.ok !== 1) {
      throw Error(`Error saving session invite: ${JSON.stringify(result)}`)
    }
  }

  async getSessionInvite(hash: string): Promise<SessionInvite | null> {
    const result: OIDable<SessionInvite> = await this.c.sessionInvites.findOne({hash})
    return transformId(result) as unknown as SessionInvite
  }

  async createSession(session: UserSessionDbObject): Promise<UserSessionDbObject> {
    const dbSession = await this.repository.client.startSession()
    dbSession.startTransaction()
    const existingSession = await this.c.sessions.findOne({hash: session.hash})
    if (existingSession) {
      dbSession.abortTransaction()
      throw new Error(`Session already exists and cannot be reinitiated`)
    } else {
      const insertResult = await this.c.sessions.insertOne(session)
      if (insertResult.result.ok !== 1) {
        dbSession.abortTransaction()
        throw new Error(`Error inserting session ${session}`)
      } else {
        await dbSession.commitTransaction()
      }
    }

    return this.c.sessions.findOne({hash: session.hash});
  }

  async getSession(hash: string): Promise<UserSessionDbObject> {
    return this.c.sessions.findOne({hash})
  }

  async getUser(userKeys: UserKeys): Promise<UserDbObject> {
    return this.c.users.findOne({
      $or: [
        {id: userKeys.email},
        {id: userKeys.username},
      ]
    })
  }

  async getUserById(id: string): Promise<UserDbObject> {
    return this.c.users.findOne({_id: new ObjectID(id)})
  }

}

export default AuthRepository;

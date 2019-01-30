import {MongoClient, Db, Collection, ObjectID} from 'mongodb';
import {Repository} from "./repository";
import {CalendarEvent, DBEntity, IDable, User, UserKeys, UserProperties} from "./types";
import {Session, SessionInvite} from "./session";

interface MongoEntity<T> extends OIDable<T> {
}

function transformId<T extends DBEntity>(mongoInstance?: MongoEntity<T>): T {
  if (!mongoInstance) {
    return null
  }
  const {_id, ...entityProps} = mongoInstance
  return {...entityProps, id: _id.toString()} as T;
}

interface OIDable<T> {
  _id?: ObjectID
}

export default class MongoRepository implements Repository {
  client: MongoClient
  dbName: string
  db: Db
  c: {
    users: Collection<OIDable<User>>,
    sessions: Collection<OIDable<Session>>,
    sessionInvites: Collection<OIDable<SessionInvite>>
    events: Collection<OIDable<CalendarEvent>>
  }

  constructor(projectId: string) {
    this.dbName = projectId
  }

  async connect() {
    console.log('Will connect to mongo db')
    this.client = await MongoClient.connect('mongodb://localhost', {useNewUrlParser: true})
    this.db = this.client.db(this.dbName)
    this.c = {
      users: this.db.collection<OIDable<User>>('users'),
      sessions: this.db.collection<OIDable<Session>>('sessions'),
      sessionInvites: this.db.collection<OIDable<SessionInvite>>('session_invites'),
      events: this.db.collection<OIDable<CalendarEvent>>('events'),
    }
    console.log('Mongo connected and collections set up')
  }

  async createUser(userProperties: UserProperties): Promise<User> {
    if (!(userProperties.username && userProperties.email)) {
      const message = `Cannot create user without username and email: ${JSON.stringify(userProperties)}`
      console.error(message)
      return Promise.reject(new Error(message))
    }
    const dbSession = await this.client.startSession()
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
      const insertResult = await this.c.users.insertOne(userProperties as OIDable<User>)

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

    const retrievedUser = await this.c.users.findOne({username: userProperties.username, email: userProperties.email})
    return transformId(retrievedUser) as User
  }

  async saveSessionInvite(invite: SessionInvite) {
    const result = await this.c.sessionInvites.insertOne(invite as OIDable<SessionInvite>)
    if (result.result.ok !== 1) {
      throw Error(`Error saving session invite: ${JSON.stringify(result)}`)
    }
  }

  async getSessionInvite(hash: string): Promise<SessionInvite | null> {
    const result = await this.c.sessionInvites.findOne({hash})
    return transformId(result) as SessionInvite
  }

  async createSession(session: Session): Promise<Session> {
    const dbSession = await this.client.startSession()
    dbSession.startTransaction()
    const existingSession = await this.c.sessions.findOne({hash: session.hash})
    if (existingSession) {
      dbSession.abortTransaction()
      throw new Error(`Session already exists with this hash for user ${session.userId}`)
    } else {
      const insertResult = await this.db.collection('sessions').insertOne(session)
      if (insertResult.result.ok !== 1) {
        dbSession.abortTransaction()
        throw new Error(`Error inserting session ${session}`)
      } else {
        await dbSession.commitTransaction()
      }
    }

    const result = await this.c.sessions.findOne({hash: session.hash});
    return transformId(result) as Session
  }

  async getSession(hash: string): Promise<Session> {
    const result = await this.c.sessions.findOne({hash})
    return transformId(result) as Session
  }

  async getUser(userKeys: UserKeys): Promise<User> {
    const result = await this.c.users.findOne({
      $or: [
        {id: userKeys.email},
        {id: userKeys.username},
      ]
    })
    return transformId(result) as User
  }

  async getUserById(id: string): Promise<User> {
    const result = await this.c.users.findOne({_id: new ObjectID(id)})
    return transformId(result) as User
  }

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const insertResult = await this.c.events.insertOne(event as OIDable<CalendarEvent>)
    if (insertResult.result.ok !== 1) {
      throw new Error(`Could new insert event ${JSON.stringify(event)}`)
    }
    return transformId(await this.c.events.findOne({
      _id: insertResult.insertedId
    })) as CalendarEvent
  }

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const {id, ...strippedFromId} = event;
    const updateResult = await this.c.events.updateOne({
      _id: event.id
    }, strippedFromId as OIDable<CalendarEvent>)
    if (updateResult.result.ok !== 1) {
      throw new Error(`Error updating event ${event.id}`)
    }
    const result = await this.c.events.findOne({_id: event.id})
    return transformId(result) as CalendarEvent
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    return transformId(await this.c.events.findOne({_id: id})) as CalendarEvent
  }

}

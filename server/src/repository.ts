import {MongoClient, Db, Collection, ObjectID} from 'mongodb';
import {CalendarEventDbObject, UserDbObject, UserSessionDbObject} from "./@types";

export interface MongoEntity<T> extends OIDable<T> {
}

export function transformId<T extends {_id: ObjectID}>(mongoInstance?: MongoEntity<T>): T {
  if (!mongoInstance) {
    return null
  }
  const {_id, ...entityProps} = mongoInstance
  return {...entityProps, id: _id.toString()} as unknown as T;
}

export interface OIDable<T> {
  _id?: ObjectID
}

export interface Collections {
  events: Collection<OIDable<CalendarEventDbObject>>
}

export default class Repository {
  client: MongoClient
  dbName: string
  db: Db
  public c: Collections
  constructor(projectId: string) {
    this.dbName = projectId
  }

  async connect() {
    console.log('Will connect to mongo db')
    this.client = await MongoClient.connect('mongodb://localhost', {useNewUrlParser: true})
    this.db = this.client.db(this.dbName)
    this.c = {
      events: this.db.collection<CalendarEventDbObject>('events'),
    }
    console.log('Mongo connected and collections set up')
  }

}

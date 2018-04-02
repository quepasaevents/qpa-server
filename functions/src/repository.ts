const Datastore = require('@google-cloud/datastore')
import {SessionInvite, User, UserKeys} from './types'
import { projectId } from './config'

const datastore = Datastore({
  projectId: projectId,
});

export default class Repository {

  static createUser(user: User) {
    const entity = {
      key: datastore.key('User'),
      data: user
    }
    return datastore.save(entity)
  }

  static async saveSessionInvite(invite: SessionInvite) {
    const entity = {
      key: datastore.key('SessionInvite'),
      data: invite
    }
    return await datastore.save(entity)
  }

  static async getUser (user: UserKeys) {
    let query = datastore
      .createQuery('user')

    if (user.email) {
      query = query.filter('email', '=', user.email)
    }
    if (user.username) {
      query = query.filter('username', '=', user.username)
    }

    return await datastore.runQuery(query)
      .then(results => {
        return results[0]
      });
  };
}
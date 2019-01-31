import Repository from './repository'
import {User, UserKeys, UserProperties} from './types'

export default class UserManager {
  repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  getUser = async (keys: UserKeys) => {
    return await this.repository.getUser(keys)
  }

  createUser = async (user: UserProperties): Promise<User> => {
    return this.repository.createUser(user)
  }

}


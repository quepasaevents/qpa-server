import {User, UserKeys, UserProperties} from './types'
import Repository from './repository'

export default class UserManager {
  repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  getUser = async (keys: UserKeys) => {
    return await this.repository.getUser(keys)
  }

  createUser = async (user: UserProperties): Promise<User> => {
    return await this.repository.createUser(user)
  }

}


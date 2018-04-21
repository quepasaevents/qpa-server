import {User, UserKeys, UserProperties} from './types'
import repository from './repository'

export const getUser = async (keys: UserKeys) => {
  return await repository.getUser(keys)
}

export const createUser = async (user: UserProperties): Promise<User> => {
  return await repository.createUser(user)
}
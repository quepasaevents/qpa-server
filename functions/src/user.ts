import {UserKeys} from './types'
import repository from './repository'

export const getUser = async (keys: UserKeys) => {
  return await repository.getUser(keys)
}
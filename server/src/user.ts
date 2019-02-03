import Repository from './repository'
import {SignupInput, User, UserDbObject} from "./@types";
import AuthRepository from "./Auth/AuthRepository";

export default class UserManager {
  authRepository: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  getUser = async (keys) => {
    return await this.authRepository.getUser(keys)
  }

  createUser = async (user: SignupInput): Promise<UserDbObject> => {
    return this.authRepository.createUser(user)
  }

}


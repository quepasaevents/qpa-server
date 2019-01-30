import {Repository} from "../repository";
import {User} from "../types";
import UserManager from "../user";
import SessionManager from "../session";

interface AuthQueryResolvers {
}


interface AuthMutationResolvers {
}

export default class AuthResolvers {
  userManager: UserManager
  repository: Repository
  sessionManager: SessionManager

  constructor({repository, userManager, sessionManager}) {
    this.userManager = repository;
    this.sessionManager = sessionManager;
  }

  Query = {}

  Mutation = {
    signup: async (_, req, context, info) => {
      const {username, email, firstName, lastName} = req.input;
      let newUser: User = null
      newUser = await this.userManager.createUser({username, email, firstName, lastName})
      if (!newUser) {
        throw new Error("New user was not created for request" + JSON.stringify(req))
      }
      return !!newUser
    },
    signin: async (_, {hash}, context, info) => {
      const session = await this.sessionManager.initiateSession({hash});
      if (!session || !session.isValid) {
        throw new Error('Could not find session invite')
      }
      // Client has to set session token
      return session;
    },
    requestInvite: async (_, {email}, context, info) => {
      const invite = await this.sessionManager.inviteUser(email)
      if (!invite) {
        throw new Error('Invitation failed')
      }
      return true
    },
  }
}

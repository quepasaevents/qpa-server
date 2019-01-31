import Repository from "../repository";
import {User} from "../types";
import UserManager from "../user";
import SessionManager from "../session";

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

      try {
        this.sessionManager.inviteUser(newUser.email)
      } catch (e) {
        console.error('Error sending invitation', e)
      }
      return !!newUser
    },
    signin: async (_, req, context, info) => {
      const session = await this.sessionManager.initiateSession(req.input.hash);
      if (!session || !session.isValid) {
        throw new Error('Could not find session invite')
      }

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

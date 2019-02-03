import Repository from "../repository";
import UserManager from "../user";
import SessionManager from "./SessionManager";
import {MutationResolvers, User, UserDbObject} from "../@types";
import SignupArgs = MutationResolvers.SignupArgs;
import SigninArgs = MutationResolvers.SigninArgs;
import RequestInviteArgs = MutationResolvers.RequestInviteArgs;

export default class AuthResolvers {
  userManager: UserManager
  repository: Repository
  sessionManager: SessionManager

  constructor({repository, userManager, sessionManager}) {
    this.userManager = repository;
    this.sessionManager = sessionManager;
  }

  Query = {

  }

  Mutation = {
    signup: async (_, args: SignupArgs, context, info) => {
      const newUser = await this.userManager.createUser(args.input)
      if (!newUser) {
        throw new Error("New user was not created for request" + JSON.stringify(args))
      }

      try {
        await this.sessionManager.inviteUser(newUser.email)
      } catch (e) {
        console.error('Error sending invitation', e)
      }
      return !!newUser
    },
    signin: async (_, req: SigninArgs, context, info) => {
      const session = await this.sessionManager.initiateSession(req.input.hash);
      if (!session || !session.isValid) {
        throw new Error('Could not find session invite')
      }

      return session;
    },
    requestInvite: async (_, req: RequestInviteArgs, context, info) => {
      const invite = await this.sessionManager.inviteUser(req.input.email)
      if (!invite) {
        throw new Error('Invitation failed')
      }
      return true
    },
  }
}

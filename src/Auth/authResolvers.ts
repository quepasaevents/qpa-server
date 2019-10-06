import SessionManager, { SessionAlreadyValidatedError } from "./SessionManager"
import { User } from "./User.entity"
import { PostOffice } from "../post_office"
import {Context} from "../@types/graphql-utils"
import UserRole from "./UserRole.entity";

interface Dependencies {
  sendEmail: PostOffice
  emailTargetDomain?: string
  sessionManager: SessionManager
}
export default class AuthResolvers {
  sessionManager: SessionManager
  sendEmail: PostOffice

  constructor(deps: Dependencies) {
    this.sessionManager = deps.sessionManager
    this.sendEmail = deps.sendEmail
  }

  Query = {
    me: async (_, req, context: Context, info) => {
      return context.user
    }
  }

  Mutation = {
    signup: async (_, args: GQL.ISignupOnMutationArguments, context, info) => {
      const errors = []
      const userExists = await User.findOne({ email: args.input.email })
      if (userExists) {
        errors.push({
          path: "email",
          message: "Email taken"
        })
      }
      if (await User.findOne({ username: args.input.username })) {
        errors.push({
          path: "username",
          message: "Username taken"
        })
      }

      if (errors.length) {
        return errors
      }

      const newUser = new User()
      newUser.name = args.input.name
      newUser.email = args.input.email
      newUser.username = args.input.username

      await newUser.save()

      if (!newUser.id) {
        throw new Error("Could not create user")
      }

      try {
        await this.sessionManager.inviteUser(newUser)
      } catch (e) {
        throw e
      }
      return null
    },
    signin: async (_, req, context, info) => {
      let session
      try {
        session = await this.sessionManager.initiateSession(req.input.hash)
      } catch (e) {
          console.log(e)
      }
      if (!session || !session.isValid) {
        throw new Error("Could not find session invite or invite is invalid.")
      }

      return session
    },
    requestInvite: async (
      _,
      req: GQL.IRequestInviteOnMutationArguments,
      context,
      info
    ) => {
      const user = await User.findOne({ email: req.input.email })
      if (user) {
        this.sessionManager.inviteUser(user)
      }

      return true
    },
    grantRole: async (_, args: GQL.IGrantRoleOnMutationArguments, context: Context, info): Promise<User> => {
      const thisUser = await context.user
      if (!thisUser) {
        throw new Error("User not logged in")
      }
      const thisUserRoles: UserRole[] = await thisUser.roles
      const isAdmin = !!thisUserRoles.find(role => role.type === 'admin')
      if (!isAdmin) {
        throw new Error("User not logged in")
      }
      const { userId, roleType } = args.input

      const grantee = await User.findOne(userId)
      if (!grantee) {
        throw new Error("Grantee user not found")
      }
      const existingRoles = await grantee.roles
      const hasRole = existingRoles.find(role => role.type === roleType)

      if (!hasRole) {
        const newRole = new UserRole()
        newRole.type = roleType
        newRole.user = Promise.resolve(grantee)
        await newRole.save()
      }

      return grantee
    },
    revokeRole: async (_, args: GQL.IRevokeRoleOnMutationArguments, context: Context, info) => {
      const thisUser = await context.user
      if (!thisUser) {
        throw new Error("User not logged in")
      }
      const thisUserRoles: UserRole[] = await thisUser.roles
      const isAdmin = !!thisUserRoles.find(role => role.type === 'admin')
      if (!isAdmin) {
        throw new Error("User not logged in")
      }

      const { userId, roleType } = args.input
      const revokee = await User.findOne(userId)
      if (!revokee) {
        throw new Error("Revokee user not found")
      }
      const existingRoles = await revokee.roles
      const hasRole = !!existingRoles.find(role => role.type === roleType)
      if (hasRole) {
        revokee.roles = Promise.resolve(existingRoles.filter(role => role.type !== roleType))
        await revokee.save()
      }
      return revokee
    },
  }

  UserSession = {
    user: async (userSession, req, context, info) => {
      return userSession.user
    }
  }
}

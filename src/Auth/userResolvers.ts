import { Context, ResolverMap } from "../@types/graphql-utils";
import UserRole, { RoleType } from "./UserRole.entity";
import { User } from "./User.entity";
import { hasAnyRole } from "./authUtils";

const SetUnsetRoleRequiresRoles: { [s: string]: RoleType[] } = {
  admin: ["admin"],
  embassador: ["admin"],
  organizer: ["admin", "embassador"]
};
const SupportedRoles = Object.keys(SetUnsetRoleRequiresRoles);

export default {
  Query: {
    user: async (_, req: GQL.IUserOnQueryArguments, context: Context) => {
      const currentUser = context.user;
      if (!currentUser) {
        throw new Error("Must be logged in");
      }
      const rolesTypes: RoleType[] = (await context.user.roles).map(
        role => role.type
      );

      const allowedToFetchUser =
        rolesTypes.includes("embassador") || rolesTypes.includes("admin");
      if (!allowedToFetchUser) {
        throw new Error("You cant fetch users");
      }

      return User.findOne(req.id);
    }
  },
  Mutation: {
    grantRole: async (
      _,
      { input }: GQL.IGrantRoleOnMutationArguments,
      context
    ) => {
      const desiredRole: RoleType = input.roleType;
      if (!SupportedRoles.includes(desiredRole)) {
        throw new Error(`Role '${desiredRole}' not supported`);
      }

      const necessaryRoles = SetUnsetRoleRequiresRoles[desiredRole];
      const requesterRoles = await context.user.roles;

      const userHasSufficientRoles = hasAnyRole(requesterRoles, necessaryRoles);
      if (!userHasSufficientRoles) {
        throw new Error("Insufficient role");
      }

      const userToBeGranted = await User.findOne(input.userId);
      const existingRoles = await userToBeGranted.roles;
      const userAlreadyHasRole = existingRoles.some(
        existingRole => existingRole.type === desiredRole
      );

      console.log(`user ${context.user.id} with roles ${JSON.stringify(requesterRoles)} will grant role ${desiredRole} to user ${input.userId}`)
      if (!userAlreadyHasRole) {
        const newRole = new UserRole();
        newRole.type = desiredRole;
        newRole.user = Promise.resolve(userToBeGranted);
        userToBeGranted.roles = Promise.resolve([
          ...(await existingRoles),
          newRole
        ]);
        await userToBeGranted.save();
        await newRole.save();
      }

      return userToBeGranted;
    },
    revokeRole: async (
      _,
      { input }: GQL.IRevokeRoleOnMutationArguments,
      context
    ) => {
      const roleTypeToBeRevoked: RoleType = input.roleType;
      if (!SupportedRoles.includes(roleTypeToBeRevoked)) {
        throw new Error(`Role '${roleTypeToBeRevoked}' not supported`);
      }

      const necessaryRoles = SetUnsetRoleRequiresRoles[roleTypeToBeRevoked];
      const requesterRoles = await context.user.roles;

      const userHasSufficientRoles = hasAnyRole(requesterRoles, necessaryRoles);
      if (!userHasSufficientRoles) {
        throw new Error("Insufficient role");
      }
      const userToBeRevoked = await User.findOne(input.userId);
      const existingRoles = await userToBeRevoked.roles;
      const userHasRole = existingRoles.some(
        existingRole => existingRole.type === roleTypeToBeRevoked
      );
      console.log(`user ${context.user.id} with roles ${JSON.stringify(requesterRoles)} will revoke role ${roleTypeToBeRevoked} from user ${input.userId}`)

      if (userHasRole) {
        const roleToBeDeleted = (await userToBeRevoked.roles).find(role => role.type === roleTypeToBeRevoked)
        await roleToBeDeleted.remove()
      }
      return User.findOne(input.userId)
    }
  },
  User: {
    events: async user => {
      return user.events;
    },
    email: async (user: User, req, context: Context) => {
      if (!context.user) {
        throw new Error("Cannot get email");
      }
      if (
        !(await context.user.roles).map(role => role.type).includes("admin")
      ) {
        throw new Error("Not allowed to fetch email");
      }
      return user.email;
    }
  }
} as ResolverMap;

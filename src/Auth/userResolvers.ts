import { Context, ResolverMap } from "../@types/graphql-utils";
import UserRole, { RoleType } from "./UserRole.entity";
import { User } from "./User.entity";

const SetRoleRequiresRoles: { [s: string]: RoleType[] } = {
  admin: ["admin"],
  embassador: ["admin"],
  organizer: ["admin", "embassador"]
};
const SupportedRoles = Object.keys(SetRoleRequiresRoles);

const hasAnyRole = (
  requesterRoles: UserRole[],
  requiredRoles: RoleType[]
): boolean => {
  if (!requesterRoles) {
    return false;
  }
  const requesterRoleTypes = requesterRoles.map(role => role.type);
  return requiredRoles.some(requiredRoleType =>
    requesterRoleTypes.includes(requiredRoleType)
  );
};

export default {
  Query: {
    user: async (_, req: GQL.IUserOnQueryArguments, context: Context) => {
      const currentUser = context.user
      if (!currentUser) {
        throw new Error("Must be logged in")
      }
      const rolesTypes: RoleType[] = (await context.user.roles).map(role => role.type)

      const allowedToFetchUser = rolesTypes.includes('embassador') || rolesTypes.includes('admin')
      if (!allowedToFetchUser) {
        throw new Error("You cant fetch users")
      }

      return User.findOne(req.id)
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

      const necessaryRoles = SetRoleRequiresRoles[desiredRole];
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
    revokeRole: () => {}
  },
  User: {
    events: async user => {
      return user.events;
    },
    email: async (user: User, req, context: Context) => {
      if (!context.user) {
        throw new Error("Cannot get email");
      }
      if (!(await context.user.roles).map(role => role.type).includes('admin')) {
        throw new Error("Not allowed")
      }
      return user.email
    }
  }
} as ResolverMap;

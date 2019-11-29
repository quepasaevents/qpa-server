import UserRole, { RoleType } from "./UserRole.entity";
import { Context } from "../@types/graphql-utils";
export const hasAnyRole = (
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
}

export const contextHasAnyRole = async (context: Context, requiredRoles: RoleType[]): Promise<boolean> => {
  const roles: UserRole[] = await (await context.user)?.roles
  return hasAnyRole(roles, requiredRoles)
}

export const hasHigherRole = async (context: Context): Promise<boolean> => {
  return contextHasAnyRole(context, ["embassador", "admin"])
}

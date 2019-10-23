import UserRole, { RoleType } from "./UserRole.entity";
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

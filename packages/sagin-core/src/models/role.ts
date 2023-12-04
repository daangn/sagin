import { type ValueOf } from '@sagin/core/utils';

export const Role = Object.freeze({
  SystemAdmin: 'sys_admin',
  Admin: 'admin',
  User: 'user',
});

export type Role = ValueOf<typeof Role>;

export function checkRole(requiredRole: Role, userRole: Role): boolean {
  return (
    (requiredRole === Role.SystemAdmin && userRole === Role.SystemAdmin) ||
    (requiredRole === Role.Admin && (userRole === Role.SystemAdmin || userRole === Role.Admin)) ||
    requiredRole === Role.User
  );
}

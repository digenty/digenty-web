export const hasPermission = (userPermissions: string[] | undefined, permission: string) => {
  if (!userPermissions) return false;
  return userPermissions.includes(permission);
};

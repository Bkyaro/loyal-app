/**
 * 查询当前已授予权限
 */
export async function getAppPermissions(admin: any): Promise<any> {
  const permissions = await admin.graphql(`
    query {
      currentAppInstallation {
        accessScopes {
          description
          handle
        }
      }
    }`);

  return permissions.json();
}

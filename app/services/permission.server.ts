/**
 * 查询当前已授予权限
 */

import { authenticate } from "~/shopify.server";

export async function getAppPermissions(request: Request): Promise<any> {
  const { admin } = await authenticate.admin(request);

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

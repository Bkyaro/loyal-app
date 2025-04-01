/**
 * 查询插件当前存在的functions
 */

import { authenticate } from "~/shopify.server";

export async function getAppFunctions(request: Request): Promise<any> {
  const { admin } = await authenticate.admin(request);

  const functions = await admin.graphql(`
    query {
        shopifyFunctions(first: 10) {
            nodes {
                id
                app {
                    title
                }
                apiType
                title
            }
        }
    }`);

  return functions.json();
}

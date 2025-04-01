/**
 * 查询插件当前存在的functions
 */

export async function getAppFunctions(admin: any): Promise<any> {
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

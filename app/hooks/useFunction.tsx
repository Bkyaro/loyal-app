import { useLoaderData } from "@remix-run/react";

export function useFunction() {
  const { functionsData } = useLoaderData<{ functionsData: any }>();

  const shopifyFunctions = functionsData?.data?.shopifyFunctions?.nodes || [];

  return {
    // 返回所有 functions
    functionsData: shopifyFunctions,

    // 获取特定类型的 function
    getFunctionsByType: (apiType: string) =>
      shopifyFunctions.filter((func: any) => func.apiType === apiType),

    // 通过标题查找 function
    getFunctionByTitle: (title: string) =>
      shopifyFunctions.find((func: any) => func.title === title),

    // 检查是否存在特定标题的 function
    hasFunctionWithTitle: (title: string) =>
      shopifyFunctions.some((func: any) => func.title === title),

    // 获取所有 function 类型
    getFunctionTypes: () =>
      Array.from(new Set(shopifyFunctions.map((func: any) => func.apiType))),

    // 获取请求成本信息
    getCostInfo: () => functionsData?.extensions?.cost || null,

    // 根据 title 和 apiType 获取 function id
    getFunctionId: (title: string, apiType?: string) => {
      const func = shopifyFunctions.find(
        (func: any) =>
          func.title === title && (apiType ? func.apiType === apiType : true),
      );
      return func?.id || null;
    },
  };
}

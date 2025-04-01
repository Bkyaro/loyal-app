import { useLoaderData } from "@remix-run/react";

export function usePermission() {
  const { permissions } = useLoaderData<{ permissions: any }>();

  const accessScopes =
    permissions?.data?.currentAppInstallation?.accessScopes || [];

  return {
    // 返回所有权限
    currentPermissions: accessScopes,

    // 检查是否有特定权限
    hasPermission: (handle: string) =>
      accessScopes.some((scope: any) => scope.handle === handle),

    // 检查是否有多个权限
    hasPermissions: (handles: string[]) =>
      handles.every((handle) =>
        accessScopes.some((scope: any) => scope.handle === handle),
      ),

    // 获取特定权限的描述
    getPermissionDescription: (handle: string) =>
      accessScopes.find((scope: any) => scope.handle === handle)?.description ||
      "",

    // 获取请求成本信息
    getCostInfo: () => permissions?.extensions?.cost || null,
  };
}

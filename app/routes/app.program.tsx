import { Outlet } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { ProgramNavigation } from "~/components/ui/ProgramNavigation";

export default function ProgramLayout() {
  // 定义所有导航标签
  const tabs = [
    {
      id: "points",
      content: "Points",
      path: "/app/program/points",
    },
    {
      id: "referrals",
      content: "Referrals",
      path: "/app/program/referrals",
    },
    {
      id: "vip",
      content: "VIP",
      path: "/app/program/vip",
    },
    {
      id: "activity",
      content: "Activity",
      path: "/app/program/activity",
    },
    {
      id: "bonus-campaigns",
      content: "Bonus Campaigns",
      path: "/app/program/bonus-campaigns",
    },
  ];

  return (
    <div className='flex flex-col w-full'>
      {/* 共享导航组件 */}
      <ProgramNavigation tabs={tabs} className='w-full' />

      {/* 内容区域 - 使用Outlet渲染子路由 */}
      <Outlet />
    </div>
  );
}

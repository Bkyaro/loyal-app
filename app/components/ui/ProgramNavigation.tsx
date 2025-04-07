import { useCallback } from "react";
import { useNavigate, useLocation } from "@remix-run/react";

interface Tab {
  id: string;
  content: string;
  path: string;
}

interface ProgramNavigationProps {
  tabs: Tab[];
  className?: string;
}

export function ProgramNavigation({
  tabs,
  className = "",
}: ProgramNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // 确定当前选中的选项卡
  const isActive = useCallback(
    (path: string) => {
      if (path === "/app/program" && location.pathname === "/app/program") {
        return true;
      }

      if (path !== "/app/program" && location.pathname.includes(path)) {
        return true;
      }

      return false;
    },
    [location],
  );

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className={`w-full border-b border-solid border-[#e1e3e5] ${className}`}
    >
      {/* 使用overflow-x-auto允许在容器内水平滚动 */}
      <div className='overflow-x-auto scrollbar-hide'>
        {/* 确保所有tab项都不会被压缩，使用nowrap和inline-flex */}
        <div className='flex flex-nowrap whitespace-nowrap px-4 md:px-6'>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`cursor-pointer px-5 py-4 text-sm font-medium flex-shrink-0 ${
                isActive(tab.path)
                  ? "text-[#5c6ac4] border-b-2 border-[#5c6ac4]"
                  : "text-[#637381] hover:text-[#212b36] hover:border-b-2 hover:border-[#c4cdd5]"
              }`}
              onClick={() => handleTabClick(tab.path)}
              role='tab'
              aria-selected={isActive(tab.path)}
              tabIndex={0}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

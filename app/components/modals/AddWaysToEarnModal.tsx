import { useState, useEffect, useCallback } from "react";
import {
  Modal,
  BlockStack,
  InlineStack,
  Button,
  Text,
  Spinner,
  Badge,
} from "@shopify/polaris";
import { WayToEarn, mockWaysToEarnData } from "~/mock/programData";
import { useNavigate } from "@remix-run/react";

// 全局缓存，用于存储已加载的数据
let cachedWaysData: Record<string, WayToEarn[]> | null = null;
let isLoadingData = false;
let dataLoadPromise: Promise<Record<string, WayToEarn[]>> | null = null;

// 映射action ID到路由参数
const actionTypeMap: Record<number, { query: string; path: string }> = {
  1: { query: "3", path: "order" }, // Place an order
  2: { query: "2", path: "birthday" }, // Celebrate a birthday
  4: { query: "1", path: "signup" }, // Signup
  // 可以根据需要添加更多的映射
};

interface AddWaysToEarnModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (way: WayToEarn) => void;
  usePathParams?: boolean; // 是否使用路径参数而不是查询参数
}

export function AddWaysToEarnModal({
  open,
  onClose,
  onSelect,
  usePathParams = false, // 默认使用查询参数方式
}: AddWaysToEarnModalProps) {
  const [groupedWays, setGroupedWays] = useState<Record<
    string,
    WayToEarn[]
  > | null>(cachedWaysData);
  const [isLoading, setIsLoading] = useState(!cachedWaysData && isLoadingData);
  const navigate = useNavigate();

  // 加载数据的函数，支持数据缓存
  const loadData = useCallback(async () => {
    // 如果已有缓存数据，直接使用
    if (cachedWaysData) {
      setGroupedWays(cachedWaysData);
      return;
    }

    // 如果已经有请求正在进行中，等待该请求完成
    if (isLoadingData && dataLoadPromise) {
      const result = await dataLoadPromise;
      setGroupedWays(result);
      setIsLoading(false);
      return;
    }

    // 开始新的请求
    setIsLoading(true);
    isLoadingData = true;

    // 创建一个请求Promise
    dataLoadPromise = new Promise<Record<string, WayToEarn[]>>((resolve) => {
      // 模拟API请求延迟
      setTimeout(() => {
        // 按分类分组的数据
        const grouped = mockWaysToEarnData.reduce(
          (groups, way) => {
            const category = way.category || "OTHER";
            if (!groups[category]) {
              groups[category] = [];
            }
            groups[category].push(way);
            return groups;
          },
          {} as Record<string, WayToEarn[]>,
        );

        // 更新缓存
        cachedWaysData = grouped;
        isLoadingData = false;
        resolve(grouped);
      }, 800); // 800ms延迟模拟网络请求
    });

    // 等待请求完成并更新状态
    const result = await dataLoadPromise;
    setGroupedWays(result);
    setIsLoading(false);
  }, []);

  // 当弹窗打开时，检查并加载数据
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, loadData]);

  // 检查action是否有对应的表单页面
  const hasForm = (wayId: number) => {
    return wayId in actionTypeMap;
  };

  // 选择项目处理函数
  const handleSelectWay = useCallback(
    (way: WayToEarn) => {
      // 关闭模态框
      onClose();

      // 检查是否有对应的路由映射
      const actionInfo = actionTypeMap[way.id];
      if (actionInfo) {
        // 根据不同的路由模式导航到对应页面
        if (usePathParams) {
          navigate(`/app/program/points/actions/new/${actionInfo.path}`);
        } else {
          navigate(
            `/app/program/points/actions/new?create=${actionInfo.query}`,
          );
        }
      } else {
        // 对于暂未实现的积分规则，使用原有的回调
        if (onSelect) {
          onSelect(way);
        }
      }
    },
    [onSelect, onClose, navigate, usePathParams],
  );

  return (
    <Modal open={open} onClose={onClose} title='Ways to earn' size='large'>
      <div>
        {isLoading ? (
          <div className='flex justify-center items-center p-8'>
            <Spinner size='large' />
          </div>
        ) : (
          <BlockStack gap='400'>
            {groupedWays &&
              Object.entries(groupedWays).map(([category, ways]) => (
                <div key={category}>
                  <div className='text-xs font-bold p-5 pb-2'>{category}</div>
                  {ways.map((way) => (
                    <div
                      key={way.id}
                      className={`py-2 cursor-pointer hover:bg-[#F4F6F8] border-b border-[#E0E0E0] last:border-b-0 ${
                        hasForm(way.id) ? "relative" : ""
                      }`}
                      onClick={() => handleSelectWay(way)}
                      title={
                        hasForm(way.id) ? "Click to configure this action" : ""
                      }
                    >
                      <InlineStack blockAlign='center'>
                        <div className='w-[40px] h-[40px] ml-5 py-2 flex items-center justify-center bg-[#fff] rounded-sm border border-[#E0E0E0]'>
                          {way.iconSvg ? (
                            <img
                              src={way.iconSvg}
                              alt={way.title}
                              className='w-[24px] h-[24px]'
                            />
                          ) : (
                            way.icon
                          )}
                        </div>
                        <div className='ml-4 h-full flex items-center'>
                          <span>{way.title}</span>
                        </div>
                      </InlineStack>
                    </div>
                  ))}
                </div>
              ))}
          </BlockStack>
        )}
      </div>
      <Modal.Section>
        <InlineStack align='end'>
          <Button onClick={onClose}>Cancel</Button>
        </InlineStack>
      </Modal.Section>
    </Modal>
  );
}

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
import {
  WayToEarn,
  WayToRedeem,
  mockWaysToEarnData,
  mockWaysToRedeemData,
} from "~/mock/programData";
import { useNavigate } from "@remix-run/react";

// 全局缓存，用于存储已加载的数据
let cachedEarnData: Record<string, WayToEarn[]> | null = null;
let cachedRedeemData: Record<string, WayToRedeem[]> | null = null;
let isLoadingEarnData = false;
let isLoadingRedeemData = false;
let earnDataLoadPromise: Promise<Record<string, WayToEarn[]>> | null = null;
let redeemDataLoadPromise: Promise<Record<string, WayToRedeem[]>> | null = null;

// 映射action ID到路由参数
const actionTypeMap: Record<number, { query: string; path: string }> = {
  1: { query: "3", path: "order" }, // Place an order
  2: { query: "2", path: "birthday" }, // Celebrate a birthday
  4: { query: "1", path: "signup" }, // Signup
  // 可以根据需要添加更多的映射
};

// 映射redeem ID到路由参数 (如果需要)
const redeemTypeMap: Record<number, { query: string; path: string }> = {
  1: { query: "1", path: "amount-discount" }, // Amount discount
  2: { query: "2", path: "percentage-off" }, // Percentage off
  3: { query: "3", path: "free-shipping" }, // Free shipping
};

interface AddWaysToEarnModalProps {
  mode: "earn" | "redeem";
  open: boolean;
  onClose: () => void;
  usePathParams?: boolean; // 是否使用路径参数而不是查询参数
}

export function AddWaysToEarnModal({
  mode,
  open,
  onClose,
  usePathParams = false, // 默认使用查询参数方式
}: AddWaysToEarnModalProps) {
  const [groupedEarnWays, setGroupedEarnWays] = useState<Record<
    string,
    WayToEarn[]
  > | null>(cachedEarnData);

  const [groupedRedeemWays, setGroupedRedeemWays] = useState<Record<
    string,
    WayToRedeem[]
  > | null>(cachedRedeemData);

  const [isLoading, setIsLoading] = useState(
    (mode === "earn" && !cachedEarnData && isLoadingEarnData) ||
      (mode === "redeem" && !cachedRedeemData && isLoadingRedeemData),
  );

  const navigate = useNavigate();

  // 动态设置标题
  const modalTitle = mode === "earn" ? "Ways to earn" : "Ways to redeem";

  // 重置加载状态和数据
  useEffect(() => {
    // 当模式切换时重置状态，确保正确加载
    if (open) {
      if (mode === "earn" && !cachedEarnData) {
        setIsLoading(true);
      } else if (mode === "redeem" && !cachedRedeemData) {
        setIsLoading(true);
      }
    }
  }, [mode, open]);

  // 加载数据的函数，支持数据缓存
  const loadData = useCallback(async () => {
    if (mode === "earn") {
      // 处理积分获取方式数据
      if (cachedEarnData) {
        setGroupedEarnWays(cachedEarnData);
        setIsLoading(false);
        return;
      }

      if (isLoadingEarnData && earnDataLoadPromise) {
        const result = await earnDataLoadPromise;
        setGroupedEarnWays(result);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      isLoadingEarnData = true;

      earnDataLoadPromise = new Promise<Record<string, WayToEarn[]>>(
        (resolve) => {
          setTimeout(() => {
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

            cachedEarnData = grouped;
            isLoadingEarnData = false;
            resolve(grouped);
          }, 800);
        },
      );

      const result = await earnDataLoadPromise;
      setGroupedEarnWays(result);
      setIsLoading(false);
    } else {
      // 处理积分兑换方式数据
      if (cachedRedeemData) {
        setGroupedRedeemWays(cachedRedeemData);
        setIsLoading(false);
        return;
      }

      if (isLoadingRedeemData && redeemDataLoadPromise) {
        const result = await redeemDataLoadPromise;
        setGroupedRedeemWays(result);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      isLoadingRedeemData = true;

      redeemDataLoadPromise = new Promise<Record<string, WayToRedeem[]>>(
        (resolve) => {
          setTimeout(() => {
            const grouped = mockWaysToRedeemData.reduce(
              (groups, way) => {
                const category = way.category || "OTHER";
                if (!groups[category]) {
                  groups[category] = [];
                }
                groups[category].push(way);
                return groups;
              },
              {} as Record<string, WayToRedeem[]>,
            );

            cachedRedeemData = grouped;
            isLoadingRedeemData = false;
            resolve(grouped);
          }, 800);
        },
      );

      const result = await redeemDataLoadPromise;
      setGroupedRedeemWays(result);
      setIsLoading(false);
    }
  }, [mode]);

  // 当弹窗打开时或模式变化时，检查并加载数据
  useEffect(() => {
    if (open) {
      // 确保我们总是加载正确类型的数据
      loadData();
    }
  }, [open, loadData, mode]);

  // 检查action是否有对应的表单页面
  const hasForm = (wayId: number, itemMode: "earn" | "redeem") => {
    return itemMode === "earn"
      ? wayId in actionTypeMap
      : wayId in redeemTypeMap;
  };

  // 选择项目处理函数
  const handleSelectWay = useCallback(
    (way: WayToEarn | WayToRedeem) => {
      // 关闭模态框
      onClose();

      if (mode === "earn") {
        const earnWay = way as WayToEarn;
        // 检查是否有对应的路由映射
        const actionInfo = actionTypeMap[earnWay.id];
        if (actionInfo) {
          // 根据不同的路由模式导航到对应页面
          if (usePathParams) {
            navigate(`/app/program/points/actions/new/${actionInfo.path}`);
          } else {
            navigate(
              `/app/program/points/actions/new?create=${actionInfo.query}`,
            );
          }
        }
      } else {
        const redeemWay = way as WayToRedeem;
        // 处理兑换方式选择
        const redeemInfo = redeemTypeMap[redeemWay.id];
        if (redeemInfo) {
          // 根据不同的路由模式导航到对应页面
          if (usePathParams) {
            navigate(`/app/program/points/rewards/new/${redeemInfo.path}`);
          } else {
            navigate(
              `/app/program/points/rewards/new?create=${redeemInfo.query}`,
            );
          }
        }
      }
    },
    [onClose, navigate, usePathParams, mode],
  );

  return (
    <Modal open={open} onClose={onClose} title={modalTitle} size='large'>
      <div>
        {isLoading ? (
          <div className='flex justify-center items-center p-8'>
            <Spinner size='large' />
          </div>
        ) : (
          <BlockStack gap='400'>
            {mode === "earn" &&
              groupedEarnWays &&
              Object.entries(groupedEarnWays).map(([category, ways]) => (
                <div key={category}>
                  <div className='text-xs font-bold p-5 pb-2'>{category}</div>
                  {ways.map((way) => (
                    <div
                      key={way.id}
                      className={`py-2 cursor-pointer hover:bg-[#F4F6F8] border-b border-[#E0E0E0] last:border-b-0 ${
                        hasForm(way.id, "earn") ? "relative" : ""
                      }`}
                      onClick={() => handleSelectWay(way)}
                      title={
                        hasForm(way.id, "earn")
                          ? "Click to configure this action"
                          : ""
                      }
                    >
                      <InlineStack blockAlign='center'>
                        <div className='w-[40px] h-[40px] ml-5 py-2 flex items-center justify-center bg-[#fff] rounded-sm border border-[#E0E0E0]'>
                          <img
                            src={
                              way.isCustomIcon ? way.customIcon : way.iconSvg
                            }
                            alt={way.title}
                            className='w-[24px] h-[24px]'
                          />
                        </div>
                        <div className='ml-4 h-full flex items-center'>
                          <span>{way.title}</span>
                        </div>
                        <div className='ml-auto mr-5'>
                          <span className='text-sm text-[#637381]'>
                            {way.points} points
                          </span>
                        </div>
                      </InlineStack>
                    </div>
                  ))}
                </div>
              ))}

            {mode === "redeem" &&
              groupedRedeemWays &&
              Object.entries(groupedRedeemWays).map(([category, ways]) => (
                <div key={category}>
                  <div className='text-xs font-bold p-5 pb-2'>{category}</div>
                  {ways.map((way) => (
                    <div
                      key={way.id}
                      className={`py-2 cursor-pointer hover:bg-[#F4F6F8] border-b border-[#E0E0E0] last:border-b-0 ${
                        hasForm(way.id, "redeem") ? "relative" : ""
                      }`}
                      onClick={() => handleSelectWay(way)}
                      title={
                        hasForm(way.id, "redeem")
                          ? "Click to configure this reward"
                          : ""
                      }
                    >
                      <InlineStack blockAlign='center'>
                        <div className='w-[40px] h-[40px] ml-5 py-2 flex items-center justify-center bg-[#fff] rounded-sm border border-[#E0E0E0]'>
                          <img
                            src={
                              way.isCustomIcon ? way.customIcon : way.iconSvg
                            }
                            alt={way.title}
                            className='w-[24px] h-[24px]'
                          />
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

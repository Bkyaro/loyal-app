import { useState, useEffect } from "react";
import { Page, Card, Text, Loading, Link } from "@shopify/polaris";
import { useNavigate, useSearchParams, Outlet } from "@remix-run/react";
import { PointsRuleItem } from "~/components/sections/PointsRuleItems";
import { WayToRedeem, mockWaysToRedeemData } from "~/mock/programData";
import programData from "~/mock/programData";
import { AddPointsRuleModal } from "~/components/modals/AddPointsRuleModal";
import { redeemPointRuleCost, redeemPointRuleTitle } from "~/components/tools";

const { emptySearchSvg } = programData;

export default function ProgramRewards() {
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<WayToRedeem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [usePathParams, setUsePathParams] = useState(false); // 默认使用查询参数路由
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 检查URL参数是否需要显示活动规则选择弹窗
  useEffect(() => {
    const shouldShowModal = searchParams.get("select_activity_rule") === "true";
    // 检查是否应该使用路径参数
    const routeType = searchParams.get("route_type");
    if (routeType === "path") {
      setUsePathParams(true);
    }

    if (shouldShowModal) {
      setShowAddModal(true);
    }
  }, [searchParams]);

  // 模拟数据加载
  useEffect(() => {
    const fetchData = () => {
      // 模拟API调用
      setTimeout(() => {
        const redeems = mockWaysToRedeemData.map((redeem) => ({
          ...redeem,
          totalRewarded: Math.floor(Math.random() * 100), // Random number for demo
        }));
        setRewards(redeems);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const handleBackClick = () => {
    navigate("/app/program/points");
  };

  const handleAddWaysClick = () => {
    setShowAddModal(true);
  };

  // 处理选择积分规则
  const handleSelectWay = (way: WayToRedeem) => {
    console.log("Selected way to earn:", way);
  };

  if (loading) {
    return <Loading />;
  }

  // 检查是否正在访问子路由
  const isSubRouteActive =
    window.location.pathname.includes("/app/program/points/rewards/") &&
    window.location.pathname !== "/app/program/points/rewards/";

  // 如果访问的是子路由，则渲染子路由的内容
  if (isSubRouteActive) {
    return <Outlet />;
  }

  // 如果没有积分兑换方式，显示空状态
  return (
    <Page
      backAction={{
        content: "Program",
        onAction: handleBackClick,
      }}
      title='Rewards'
      primaryAction={{
        content: "Add ways to redeem",
        onAction: handleAddWaysClick,
      }}
      fullWidth={true}
    >
      {!rewards || !rewards.length ? (
        <Card>
          <div className='w-full flex justify-center items-center p-4 flex-col'>
            <img
              src={emptySearchSvg}
              alt='No rewards found'
              className='w-[120px] mb-4'
            />
            <Text variant='headingMd' as='h2'>
              No rewards found
            </Text>
            <div className='mt-4'>
              <Link
                url='#'
                onClick={() => setShowAddModal(true)}
                removeUnderline
              >
                Add a reward
              </Link>{" "}
              so your customers can start redeeming points.
            </div>
          </div>
        </Card>
      ) : (
        <Card padding='0'>
          <div className='w-[80vw] slim:w-[100vw]'>
            {rewards.map((redeem, index) => (
              <div key={redeem.id}>
                <PointsRuleItem
                  mode='redeem'
                  active={redeem.active}
                  id={redeem.id}
                  isCustomIcon={redeem.isCustomIcon}
                  customIcon={redeem.customIcon}
                  iconSvg={redeem.iconSvg}
                  title={redeemPointRuleTitle(
                    redeem.type,
                    redeem.points_cost,
                    redeem.redeem_value,
                  )}
                  points={redeem.points_cost}
                  showDivider={index < rewards.length - 1}
                  totalRewarded={redeem.totalRewarded || 0}
                  description={redeem.title}
                  cost={redeemPointRuleCost(redeem.type, redeem.points_cost)}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 使用新的共享模态组件 */}
      <AddPointsRuleModal
        mode={"redeem"}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        usePathParams={usePathParams}
      />
    </Page>
  );
}

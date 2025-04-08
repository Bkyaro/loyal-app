import { useState, useEffect } from "react";
import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  Loading,
  InlineStack,
  Link,
  Layout,
} from "@shopify/polaris";
import { useNavigate, useSearchParams, Outlet } from "@remix-run/react";
import { WayToEarnItem } from "~/components/ui/WayToEarnItem";
import { WayToEarn, mockWaysToEarnData } from "~/mock/programData";
import programData from "~/mock/programData";
import { AddWaysToEarnModal } from "~/components/modals/AddWaysToEarnModal";

const { emptySearchSvg } = programData;

export default function ProgramActions() {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<WayToEarn[]>([]);
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
        setActions(mockWaysToEarnData);
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
  const handleSelectWay = (way: WayToEarn) => {
    console.log("Selected way to earn:", way);
    // 如果点击的是我们没有实现的action类型，可以在这里做一些特殊处理
  };

  if (loading) {
    return <Loading />;
  }

  // 检查是否正在访问子路由
  const isSubRouteActive = window.location.pathname.includes(
    "/app/program/points/actions/new",
  );

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
      title='Actions'
      primaryAction={{
        content: "Add ways to earn",
        onAction: handleAddWaysClick,
      }}
      fullWidth={true}
    >
      {!actions || !actions.length ? (
        <Card>
          <div className='w-full flex justify-center items-center p-4 flex-col'>
            <img
              src={emptySearchSvg}
              alt='No actions found'
              className='w-[120px] mb-4'
            />
            <Text variant='headingMd' as='h2'>
              No actions found
            </Text>
            <div className='mt-4'>
              <Link url='#' onClick={() => setShowAddModal(true)}>
                Add an action
              </Link>{" "}
              so your customers can start earning points.
            </div>
          </div>
        </Card>
      ) : (
        <Card padding='0'>
          <div className='w-full'>
            {actions.map((action, index) => (
              <div key={action.id}>
                <WayToEarnItem
                  icon={action.icon}
                  iconSvg={action.iconSvg}
                  title={action.title}
                  points={action.points}
                  showDivider={index < actions.length - 1}
                  onEdit={() => console.log(`编辑规则: ${action.title}`)}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 使用新的共享模态组件 */}
      <AddWaysToEarnModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelect={handleSelectWay}
        usePathParams={usePathParams}
      />
    </Page>
  );
}

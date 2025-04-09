import { useState, useEffect, useCallback } from "react";
import {
  Page,
  Card,
  Layout,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Link,
  Badge,
  Loading,
  Divider,
} from "@shopify/polaris";
import { WayToEarnItem } from "~/components/sections/WayToEarnItem";
import { useNavigate, useLocation, Outlet } from "@remix-run/react";
import { ProgramNavigation } from "~/components/sections/ProgramNavigation";
import { AddWaysToEarnModal } from "~/components/modals/AddWaysToEarnModal";
import { actionPointRule } from "~/components/tools";
import { PointsConfigListItem } from "~/components/sections/PointsConfigListItem";

// 导入模拟数据
import programData, { WayToEarn, mockWaysToEarnData } from "~/mock/programData";
const { emptySearchSvg } = programData;

export default function AppProgram() {
  const navigate = useNavigate();
  const location = useLocation();
  // 检查当前是否在子路由
  const isSubRoute = useCallback(() => {
    return location.pathname !== "/app/program/points";
  }, [location.pathname]);

  const handleViewAllClick = () => {
    navigate("/app/program/points/actions");
  };

  // 主页的积分标签组件
  function PointsTab() {
    const [loading, setLoading] = useState(true);
    const [waysToEarn, setWaysToEarn] = useState<WayToEarn[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    // 模拟数据加载
    useEffect(() => {
      const fetchData = () => {
        // 模拟API调用
        setTimeout(() => {
          // 取消注释下面一行以模拟空状态
          // return setLoading(false);

          setWaysToEarn(mockWaysToEarnData);
          setLoading(false);
        }, 1000);
      };

      fetchData();
    }, []);

    const handleAddWaysClick = () => {
      setShowAddModal(true);
    };

    // 处理选择积分规则
    const handleSelectWay = (way: WayToEarn) => {
      console.log("Selected way to earn:", way);
    };

    if (loading) {
      return <Loading />;
    }

    // 正常状态 - 有积分兑换方式
    return (
      <BlockStack gap='500'>
        <InlineStack align='space-between'>
          <InlineStack gap='200' align='center'>
            <Text variant='headingLg' as='h2'>
              Points
            </Text>
            <Badge tone='success'>Active</Badge>
          </InlineStack>
        </InlineStack>

        <Layout>
          <Layout.Section variant='oneThird'>
            <Card>
              <BlockStack gap='400'>
                <Text variant='headingMd' as='h3'>
                  Earn points
                </Text>
                <Text variant='bodyMd' as='p'>
                  Create ways your customers can earn points when they join,
                  share, and engage with your brand. Learn more about{" "}
                  <Link
                    url='#'
                    onClick={() => {
                      console.log("跳转说明页");
                    }}
                    removeUnderline
                  >
                    how customers earn points
                  </Link>
                  .
                </Text>
                <div>
                  <Button
                    variant='primary'
                    onClick={handleAddWaysClick}
                    size='slim'
                  >
                    Add ways to earn
                  </Button>
                </div>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card padding='0'>
              <div>
                <BlockStack gap='400'>
                  <div className='flex justify-between p-4 pb-0'>
                    <Text variant='headingMd' as='h3'>
                      Ways to earn
                    </Text>
                    <Link onClick={handleViewAllClick} removeUnderline>
                      View all ways to earn
                    </Link>
                  </div>
                  {(!waysToEarn || !waysToEarn?.length) && (
                    <div className='flex justify-between p-4 pt-0'>
                      <div className='text-sm text-[#637381]'>
                        Add ways customers can earn points
                      </div>
                      <Link
                        url={`/app/program/points/actions?select_activity_rule=true`}
                      >
                        Add ways to earn
                      </Link>
                    </div>
                  )}

                  {/* todo: 后续考虑分页 */}
                  {waysToEarn.slice(0, 5).map((way, index) => (
                    <>
                      <PointsConfigListItem
                        active={way.active}
                        id={way.id}
                        icon={way.icon}
                        iconSvg={way.iconSvg}
                        title={way.title}
                        points={way.points}
                        description={actionPointRule(way.type, way.points)}
                      />
                      <Divider />
                    </>
                  ))}
                </BlockStack>
              </div>
            </Card>
          </Layout.Section>
        </Layout>

        {/* 使用新的共享模态组件 */}
        <AddWaysToEarnModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSelect={handleSelectWay}
        />
      </BlockStack>
    );
  }

  return (
    <div className='flex flex-col w-full'>
      {isSubRoute() ? (
        <Outlet />
      ) : (
        <Page>
          <PointsTab />
        </Page>
      )}
    </div>
  );
}

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
import {
  actionPointRule,
  redeemPointRuleCost,
  redeemPointRuleTitle,
} from "~/components/tools";
import { PointsConfigListItem } from "~/components/sections/PointsConfigListItem";

// 导入模拟数据
import programData, {
  WayToEarn,
  mockWaysToEarnData,
  WayToRedeem,
  mockWaysToRedeemData,
} from "~/mock/programData";
const { emptySearchSvg } = programData;

export default function AppProgram() {
  const navigate = useNavigate();
  const location = useLocation();
  // 检查当前是否在子路由
  const isSubRoute = useCallback(() => {
    return location.pathname !== "/app/program/points";
  }, [location.pathname]);

  const [modalType, setModalType] = useState<"earn" | "redeem">("earn");

  const viewEarns = () => {
    navigate("/app/program/points/actions");
  };

  const viewRedeems = () => {
    navigate("/app/program/points/rewards");
  };

  // 主页的积分标签组件
  function PointsSection() {
    const [loading, setLoading] = useState(true);
    const [waysToEarn, setWaysToEarn] = useState<WayToEarn[]>([]);
    const [waysToRedeem, setWaysToRedeem] = useState<WayToRedeem[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    // 模拟数据加载
    useEffect(() => {
      const fetchData = () => {
        // 模拟API调用
        setTimeout(() => {
          // 取消注释下面一行以模拟空状态
          // return setLoading(false);

          setWaysToEarn(mockWaysToEarnData);
          setWaysToRedeem(mockWaysToRedeemData);
          setLoading(false);
        }, 1000);
      };

      fetchData();
    }, []);

    const showEarnsModal = () => {
      setModalType("earn");
      setShowAddModal(true);
    };

    const showRedeemsModal = () => {
      setModalType("redeem");
      setShowAddModal(true);
    };

    // 处理选择积分规则
    const handleSelectWay = (way: WayToEarn) => {
      console.log("Selected way to earn:", way);
    };

    if (loading) {
      return <Loading />;
    }

    // 页面标题
    const pageTitle = () => {
      return (
        <InlineStack align='space-between'>
          <InlineStack gap='200' align='center'>
            <Text variant='headingLg' as='h2'>
              Points
            </Text>
            <Badge tone='success'>Active</Badge>
          </InlineStack>
        </InlineStack>
      );
    };

    // 正常状态 - 有积分兑换方式
    return (
      <BlockStack gap='500'>
        {pageTitle()}
        <Layout>
          {/* 积分获取配置 */}
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
                    onClick={showEarnsModal}
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
                    <Link onClick={viewEarns} removeUnderline>
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
                        mode='earn'
                        active={way.active}
                        id={way.id}
                        isCustomIcon={way.isCustomIcon}
                        customIcon={way.customIcon}
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

          <Layout.Section variant='fullWidth'>
            <Divider />
          </Layout.Section>

          {/* 积分兑换配置 */}
          <Layout.Section variant='oneThird'>
            <Card>
              <BlockStack gap='400'>
                <Text variant='headingMd' as='h3'>
                  Redeem points
                </Text>
                <Text variant='bodyMd' as='p'>
                  Create rewards your customers can redeem with the points
                  they’ve earned.{" "}
                  <Link
                    url='#'
                    onClick={() => {
                      console.log("跳转说明页");
                    }}
                    removeUnderline
                  >
                    Learn more about how customers redeem points.
                  </Link>
                  .
                </Text>
                <div>
                  <Button
                    variant='primary'
                    onClick={showRedeemsModal}
                    size='slim'
                  >
                    Add ways to redeem
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
                      Ways to redeem
                    </Text>
                    <Link onClick={viewRedeems} removeUnderline>
                      View all ways to redeem
                    </Link>
                  </div>
                  {(!waysToRedeem || !waysToRedeem?.length) && (
                    <div className='flex justify-between p-4 pt-0'>
                      <div className='text-sm text-[#637381]'>
                        Add ways customers can spend their points on a reward
                      </div>
                      <Link
                        url={`/app/program/points/rewards?select_activity_rule=true`}
                        removeUnderline
                      >
                        Add ways to redeem
                      </Link>
                    </div>
                  )}

                  {/* todo: 后续考虑分页 */}
                  {waysToRedeem.slice(0, 5).map((way, index) => (
                    <>
                      <PointsConfigListItem
                        mode='redeem'
                        active={way.active}
                        id={way.id}
                        isCustomIcon={way.isCustomIcon}
                        customIcon={way.customIcon}
                        iconSvg={way.iconSvg}
                        title={redeemPointRuleTitle(
                          way.type,
                          way.points_cost,
                          way.redeem_value,
                        )}
                        points={way.points_cost}
                        description={redeemPointRuleCost(
                          way.type,
                          way.points_cost,
                        )}
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
          mode={modalType}
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
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
          <PointsSection />
        </Page>
      )}
    </div>
  );
}

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
  Modal,
  Loading,
} from "@shopify/polaris";
import { WayToEarnItem } from "~/components/ui/WayToEarnItem";
import { useNavigate, useLocation, Outlet } from "@remix-run/react";
import { ProgramNavigation } from "~/components/ui/ProgramNavigation";

// 导入模拟数据
import programData, { WayToEarn, mockWaysToEarnData } from "~/mock/programData";
const { emptySearchSvg } = programData;

export default function AppProgram() {
  const [isActions, setIsActions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // 检查当前是否在子路由
  const isSubRoute = useCallback(() => {
    return location.pathname !== "/app/program/points";
  }, [location.pathname]);

  const handleViewAllClick = () => {
    navigate("/app/program/points/actions");
  };

  const handleBackClick = () => {
    navigate("/app/program/points");
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
          return setLoading(false);

          setWaysToEarn(mockWaysToEarnData);
          setLoading(false);
        }, 1000);
      };

      fetchData();
    }, []);

    const handleAddWaysClick = () => {
      setShowAddModal(true);
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
                    <Link onClick={handleViewAllClick}>
                      View all ways to earn
                    </Link>
                  </div>
                  <div className='w-full h-[1px] bg-[#E0E0E0]'></div>

                  {(!waysToEarn || !waysToEarn?.length) && (
                    <div className='flex justify-between p-4 pt-0'>
                      <div className='text-sm text-[#637381]'>
                        Add ways customers can earn points
                      </div>
                      <Link url='#' onClick={handleAddWaysClick}>
                        Add ways to earn
                      </Link>
                    </div>
                  )}

                  {waysToEarn.slice(0, 5).map((way, index) => (
                    <div key={way.id} className=''>
                      <WayToEarnItem
                        icon={way.icon}
                        iconSvg={way.iconSvg}
                        title={way.title}
                        points={way.points}
                        showDivider={index < Math.min(waysToEarn.length, 5) - 1}
                      />
                    </div>
                  ))}
                </BlockStack>
              </div>
            </Card>
          </Layout.Section>
        </Layout>

        {showAddModal && (
          <AddWaysToEarnModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </BlockStack>
    );
  }

  // 添加积分兑换方式的模态窗口
  function AddWaysToEarnModal({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) {
    // 按分类分组的数据
    const groupedWays = mockWaysToEarnData.reduce(
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

    return (
      <Modal open={open} onClose={onClose} title='Ways to earn'>
        <div>
          <BlockStack gap='400'>
            {Object.entries(groupedWays).map(([category, ways]) => (
              <div key={category}>
                <div className='text-xs font-bold p-5 pb-2 '>{category}</div>
                {ways.map((way) => (
                  <div
                    key={way.id}
                    className='py-2 cursor-pointer hover:bg-[#F4F6F8] border-b border-[#E0E0E0] last:border-b-0'
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
                      <p className='ml-4 h-full'>{way.title}</p>
                    </InlineStack>
                  </div>
                ))}
              </div>
            ))}
          </BlockStack>
        </div>
        <Modal.Section>
          <InlineStack align='end'>
            <Button onClick={onClose}>Cancel</Button>
          </InlineStack>
        </Modal.Section>
      </Modal>
    );
  }

  return (
    <div className='flex flex-col w-full'>
      <Page>{isSubRoute() ? <Outlet /> : <PointsTab />}</Page>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  Modal,
  Loading,
  InlineStack,
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { WayToEarnItem } from "~/components/ui/WayToEarnItem";
import { WayToEarn, mockWaysToEarnData } from "~/mock/programData";
import programData from "~/mock/programData";

const { emptySearchSvg } = programData;

export default function ProgramActions() {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<WayToEarn[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

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

  if (loading) {
    return <Loading />;
  }

  // 如果没有积分兑换方式，显示空状态
  if (actions.length === 0) {
    return (
      <Page
        backAction={{
          content: "Program",
          onAction: handleBackClick,
        }}
        title='Actions'
      >
        <div className='flex justify-center items-center p-4 flex-col'>
          <img
            src={emptySearchSvg}
            alt='No actions found'
            className='w-[120px] mb-4'
          />
          <Text variant='headingMd' as='h2'>
            No actions found
          </Text>
          <div className='mt-4'>
            <Button onClick={() => setShowAddModal(true)}>Add an action</Button>
          </div>
        </div>

        {showAddModal && (
          <AddWaysToEarnModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </Page>
    );
  }

  // 正常状态 - 显示所有积分兑换方式
  return (
    <Page
      backAction={{
        content: "Program",
        onAction: handleBackClick,
      }}
      title='Actions'
      primaryAction={
        <Button onClick={handleAddWaysClick}>Add ways to earn</Button>
      }
    >
      <Card>
        <BlockStack gap='400'>
          {actions.map((action, index) => (
            <div key={action.id}>
              <WayToEarnItem
                icon={action.icon}
                iconSvg={action.iconSvg}
                title={action.title}
                points={action.points}
                showDivider={index < actions.length - 1}
              />
            </div>
          ))}
        </BlockStack>
      </Card>

      {showAddModal && (
        <AddWaysToEarnModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </Page>
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

import { useState, useEffect } from "react";
import {
  Card,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  RadioButton,
  Button,
} from "@shopify/polaris";
import { ActionForm } from "~/components/sections/ActionForm";
import { ActionSummary } from "~/components/sections/ActionSummary";
import { useNavigate } from "@remix-run/react";
import { WayToEarn } from "~/mock/programData";

interface PlaceOrderActionProps {
  isEditing?: boolean;
  initialData?: WayToEarn;
  onSave?: (data: any) => void;
  onDelete?: () => void;
}

export function PlaceOrderAction({
  isEditing = false,
  initialData,
  onSave,
  onDelete,
}: PlaceOrderActionProps) {
  // 默认值
  const defaultEarningType = initialData?.earningType || "increments";
  const defaultPointsValue = initialData?.points || 200;

  // 下单获取积分类型：increments = 按订单金额获取比例积分；fixed = 固定积分
  const [earningType, setEarningType] = useState<string>(defaultEarningType);

  // 下单获取积分值
  const [pointsValue, setPointsValue] = useState<number>(defaultPointsValue);

  // 当前表单数据和初始表单数据
  const formData = { earningType, pointsValue };
  const initialFormData = {
    earningType: defaultEarningType,
    pointsValue: defaultPointsValue,
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/app/program/points/actions");
  };

  const handleAction = (formData: { active: boolean }) => {
    // 合并表单数据与组件内部状态
    const data = {
      earningType,
      pointsValue,
      active: formData.active,
    };

    // 编辑页/创建页调用不同api
    if (isEditing && onSave) {
      // 编辑页save
      onSave(data);
    } else {
      // 创建页create
      console.log("Creating place order action with", data);
      // In a real implementation, this would call an API
      navigate("/app/program/points/actions");
    }
  };

  // Summary content
  const summaryContent = (
    <ActionSummary
      items={[
        earningType === "increments"
          ? `Customers earn ${pointsValue} point for every ¥1 spent`
          : `${pointsValue} points for completing action`,
      ]}
    />
  );

  useEffect(() => {
    console.log("pointsValue", pointsValue);
  }, [pointsValue]);

  return (
    <>
      <ActionForm
        title='Place an order'
        backAction={{
          content: "Actions",
          onAction: handleBackClick,
        }}
        onPrimaryAction={handleAction}
        onDelete={isEditing ? onDelete : undefined}
        summaryContent={summaryContent}
        isEditing={isEditing}
        initialData={initialData}
        formData={formData}
        initialFormData={initialFormData}
      >
        <Card padding='0'>
          <div className='p-4'>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h2'>
                Earning type
              </Text>
              <div>
                <RadioButton
                  label='Increments of points (recommended)'
                  checked={earningType === "increments"}
                  id='increments'
                  name='earningType'
                  onChange={() => setEarningType("increments")}
                />
                <div className='mt-2'>
                  <RadioButton
                    label='Fixed amount of points'
                    checked={earningType === "fixed"}
                    id='fixed'
                    name='earningType'
                    onChange={() => setEarningType("fixed")}
                  />
                </div>
              </div>
            </BlockStack>
          </div>
        </Card>

        <div className='mt-4'>
          <Card padding='0'>
            <div>
              <BlockStack gap='400'>
                <div className='p-4'>
                  <Text variant='headingMd' as='h2'>
                    Earning value
                  </Text>
                  <div>
                    <Text variant='bodyMd' as='p'>
                      {earningType === "increments"
                        ? "Points earned for every ¥1 spent"
                        : "Points awarded"}
                    </Text>
                    <div className='mt-2'>
                      <TextField
                        label='Points'
                        labelHidden
                        value={pointsValue.toString()}
                        onChange={(value) => setPointsValue(Number(value))}
                        autoComplete='off'
                        type='number'
                        min={1}
                        suffix={pointsValue > 1 ? "points" : "point"}
                      />
                    </div>
                  </div>
                </div>
                {/* 高级版功能限制banner */}
                {/* {earningType === "increments" && (
                  <div className='text-sm bg-[#FAFBFB] p-4'>
                    Limit the number of times each customer can earn points for
                    this action.
                    <a href='#' className='text-[#006FBB] ml-1'>
                      Upgrade now →
                    </a>
                  </div>
                )} */}
              </BlockStack>
            </div>
          </Card>
        </div>

        {/* 顾客条件板块 */}
        {/* <div className='mt-4'>
          <Card>
            <div className='p-4'>
              <BlockStack gap='400'>
                <Text variant='headingMd' as='h2'>
                  Customer eligibility
                </Text>
                <Text variant='bodyMd' as='p'>
                  Upgrade to tailor actions to specific customer conditions.
                </Text>
                <div>
                  <InlineStack gap='400' blockAlign='center'>
                    <button className='bg-[#FAFBFB] border border-[#E1E3E5] rounded py-1 px-3 text-sm'>
                      Upgrade
                    </button>
                    <Text variant='bodyMd' as='span' fontWeight='medium'>
                      <a href='#' className='text-[#006FBB]'>
                        Learn more about customer eligibility
                      </a>
                    </Text>
                  </InlineStack>
                </div>
              </BlockStack>
            </div>
          </Card>
        </div> */}

        {/* 排除参与积分获取的产品板块 - 仅比例积分类型可配置 */}
        {/* <div className='mt-4'>
          <Card>
            <div className='p-4'>
              <BlockStack gap='400'>
                <InlineStack align='space-between'>
                  <Text variant='headingMd' as='h2'>
                    Product eligibility
                  </Text>
                  <div className='ml-2 px-2 py-0.5 bg-[#E4E5E7] rounded text-xs'>
                    New
                  </div>
                </InlineStack>
                <Text variant='bodyMd' as='p'>
                  Exclude specific products from earning points
                </Text>
                <div>
                  <button className='bg-[#FAFBFB] border border-[#E1E3E5] rounded py-1 px-3 text-sm'>
                    Manage exclusions
                  </button>
                </div>
              </BlockStack>
            </div>
          </Card>
        </div> */}
      </ActionForm>
    </>
  );
}

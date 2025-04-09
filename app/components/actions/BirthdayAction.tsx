import { useState, useEffect } from "react";
import {
  Card,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  List,
} from "@shopify/polaris";
import { ActionForm } from "~/components/sections/ActionForm";
import { ActionSummary } from "~/components/sections/ActionSummary";
import { useNavigate } from "@remix-run/react";
import { WayToEarn } from "~/mock/programData";

interface BirthdayActionProps {
  isEditing?: boolean;
  initialData?: WayToEarn;
  onSave?: (data: any) => void;
  onDelete?: () => void;
}

export function BirthdayAction({
  isEditing = false,
  initialData,
  onSave,
  onDelete,
}: BirthdayActionProps) {
  // 默认值
  const defaultPoints = initialData ? initialData.points : 200;

  // 状态
  const [points, setPoints] = useState<number>(defaultPoints);

  // 当前表单数据和初始表单数据
  const formData = { points };
  const initialFormData = { points: defaultPoints };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/app/program/points/actions");
  };

  const handleAction = (formData: { active: boolean }) => {
    // 合并表单数据与组件内部状态
    const data = {
      points,
      active: formData.active,
    };

    // 编辑页/创建页调用不同api
    if (isEditing && onSave) {
      // 编辑页save
      onSave(data);
    } else {
      // 创建页create
      console.log("Creating birthday action with", data);
      // In a real implementation, this would call an API
      navigate("/app/program/points/actions");
    }
  };

  // Summary content
  const summaryContent = (
    <ActionSummary
      items={[
        `${points} points for completing action`,
        `Limit of 1 per year`,
        `Customers must enter their birthday in Smile UI at least 30 days in advance to be rewarded`,
      ]}
    />
  );

  return (
    <ActionForm
      title='Celebrate a birthday'
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
              Earning value
            </Text>
            <div>
              <Text variant='bodyMd' as='p'>
                Points awarded
              </Text>
              <div className='mt-2'>
                <TextField
                  label='Points'
                  labelHidden
                  value={points.toString()}
                  min={1}
                  onChange={(value) => setPoints(Number(value))}
                  autoComplete='off'
                  type='number'
                  suffix={points > 1 ? "points" : "point"}
                />
              </div>
            </div>
          </BlockStack>
        </div>
      </Card>

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
      </div>

      <div className='mt-4'>
        <Card>
          <div className='p-4'>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h2'>
                Redemption limits
              </Text>
              <div>
                <Text variant='bodyMd' as='p'>
                  Limit of 1 per year
                </Text>
                <div className='mt-2'>
                  <Text variant='bodyMd' as='p' tone='subdued'>
                    Customers must enter their birthday in Smile UI at least 30
                    days in advance to be rewarded
                  </Text>
                </div>
              </div>
            </BlockStack>
          </div>
        </Card>
      </div> */}
    </ActionForm>
  );
}

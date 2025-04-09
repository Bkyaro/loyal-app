import { ReactNode, useState } from "react";
import {
  Page,
  Card,
  Text,
  RadioButton,
  TextField,
  InlineStack,
  BlockStack,
  ChoiceList,
  Link,
  Box,
  Badge,
  Button,
  ButtonGroup,
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { WaysToEarnSummaryCard } from "./WaysToEarnSummaryCard";
import { WaysToEarnIconCard } from "./WaysToEarnIconCard";
import { WayToEarn } from "~/mock/programData";
export interface ActionFormProps {
  title: string;
  backAction?: {
    content: string;
    onAction: () => void;
  };
  children?: ReactNode;
  summaryContent?: ReactNode;
  onPrimaryAction?: (data: { active: boolean }) => void;
  onDelete?: () => void;
  isEditing?: boolean;
  defaultIcon?: string;
  initialData?: WayToEarn;
}

export function ActionForm({
  title,
  backAction = {
    content: "Actions",
    onAction: () => {},
  },
  children,
  summaryContent,
  onPrimaryAction = () => {},
  onDelete,
  isEditing = false,
  defaultIcon,
  initialData,
}: ActionFormProps) {
  // 获取初始active状态，如果没有提供，则默认为false
  const initialActive = initialData?.active || false;

  // 添加状态跟踪当前active状态
  const [isActive, setIsActive] = useState<boolean>(initialActive);

  // 处理状态变更
  const handleStatusChange = (status: "active" | "disabled") => {
    const newActive = status === "active";
    setIsActive(newActive);
  };

  // 处理主要操作（保存/创建），包括当前active状态
  const handlePrimaryAction = () => {
    onPrimaryAction({ active: isActive });
  };

  return (
    <Page
      backAction={backAction}
      title={title}
      primaryAction={{
        content: isEditing ? "Save" : "Create",
        onAction: handlePrimaryAction,
      }}
      fullWidth
    >
      <div className='w-full flex gap-5'>
        {/* 左侧编辑区 */}
        <div className='w-2/3'>{children}</div>
        {/* 右侧summary - Icon卡片区 */}
        <div className='w-1/3'>
          {/* Summary板块 */}
          <WaysToEarnSummaryCard
            isActive={isActive}
            summaryContent={summaryContent}
            onStatusChange={handleStatusChange}
          />
          {/* 入口icon图片配置，本期不上 */}
          {/* <div className='mt-4'>
            <WaysToEarnIconCard
              isCustomIcon={isCustomIcon}
              customIcon={customIcon}
              summaryContent={summaryContent}
              onSelectChange={(value: string) => {
                console.log("value changed", value);
              }}
              defaultIcon={defaultIcon}
              CustomIconDescription={
                <Text as='p' variant='bodySm'>
                  Add a custom image to enhance the look of your program.{" "}
                  <Link url='#'>Upgrade now →</Link>
                </Text>
              }
              BottomDescription={
                <Text as='p' variant='bodySm'>
                  This is what your customers will see in store.{" "}
                  <Link url='#'>Learn more</Link> about actions.
                </Text>
              }
            />
          </div> */}
        </div>
      </div>
      {/* 如果是编辑页面，则显示删除按钮 */}
      {isEditing && onDelete && (
        <div className='mt-4 flex justify-end'>
          <Button tone='critical' size='large' onClick={onDelete}>
            Delete
          </Button>
        </div>
      )}
    </Page>
  );
}

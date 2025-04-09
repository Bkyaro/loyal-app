import { ReactNode, useState, useEffect, useCallback } from "react";
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
import { ConfirmationDialog } from "~/components/modals/ConfirmationDialog";

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
  formData?: Record<string, any>; // 当前表单数据，用于比较
  initialFormData?: Record<string, any>; // 初始表单数据，用于比较
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
  formData = {},
  initialFormData = {},
}: ActionFormProps) {
  // 获取初始active状态，如果没有提供，则默认为false
  const initialActive = initialData?.active || false;

  // 添加状态跟踪当前active状态
  const [isActive, setIsActive] = useState<boolean>(initialActive);

  // 添加状态跟踪数据是否已更改
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // 添加状态控制确认对话框
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  // 处理状态变更
  const handleStatusChange = (status: "active" | "disabled") => {
    const newActive = status === "active";
    setIsActive(newActive);
  };

  // 比较当前数据与初始数据是否有变化
  useEffect(() => {
    // 比较active状态
    const activeChanged = isActive !== initialActive;

    // 比较formData和initialFormData
    let dataChanged = false;

    // 如果提供了formData和initialFormData，则比较两者
    if (
      Object.keys(formData).length > 0 &&
      Object.keys(initialFormData).length > 0
    ) {
      // 遍历formData中的每个字段比较
      for (const key in formData) {
        if (
          JSON.stringify(formData[key]) !== JSON.stringify(initialFormData[key])
        ) {
          dataChanged = true;
          break;
        }
      }
    }

    // 设置是否有变化
    setHasChanges(activeChanged || dataChanged);
  }, [isActive, initialActive, formData, initialFormData]);

  // 处理主要操作（保存/创建），包括当前active状态
  const handlePrimaryAction = () => {
    onPrimaryAction({ active: isActive });
  };

  // 处理返回操作，检查是否有未保存的更改
  const handleBackAction = useCallback(() => {
    if (hasChanges) {
      // 如果有未保存的更改，显示确认对话框
      setShowConfirmDialog(true);
    } else {
      // 如果没有更改，直接返回
      backAction.onAction();
    }
  }, [hasChanges, backAction]);

  // 确认放弃更改
  const handleConfirmDiscard = () => {
    setShowConfirmDialog(false);
    backAction.onAction();
  };

  // 取消放弃更改
  const handleCancelDiscard = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Page
        backAction={{
          content: backAction.content,
          onAction: handleBackAction,
        }}
        title={title}
        primaryAction={{
          content: isEditing ? "Save" : "Create",
          onAction: handlePrimaryAction,
          disabled: isEditing && !hasChanges, // 编辑页面且无变化时禁用
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

      {/* 确认对话框 */}
      <ConfirmationDialog
        open={showConfirmDialog}
        title='Unsaved changes'
        message='You have unsaved changes. Are you sure you want to leave this page?'
        confirmText='Leave page'
        cancelText='Cancel'
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
        destructive={true}
      />
    </>
  );
}

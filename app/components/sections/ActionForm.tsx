import { ReactNode } from "react";
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
  onPrimaryAction?: () => void;
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
  const {
    active = false,
    isCustomIcon = false,
    customIcon = "",
  } = initialData || {};
  return (
    <Page
      backAction={backAction}
      title={title}
      primaryAction={{
        content: isEditing ? "Save" : "Create",
        onAction: onPrimaryAction,
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
            isActive={active}
            summaryContent={summaryContent}
            onStatusChange={(status) => {
              console.log("status changed", status);
            }}
          />
          <div className='mt-4'>
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
          </div>
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

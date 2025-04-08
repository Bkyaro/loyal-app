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
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { WaysToEarnSummaryCard } from "../sections/WaysToEarnSummaryCard";
import { WaysToEarnIconCard } from "../sections/WaysToEarnIconCard";

export interface ActionFormProps {
  title: string;
  backAction?: {
    content: string;
    onAction: () => void;
  };
  children?: ReactNode;
  summaryContent?: ReactNode;
  primaryActionContent?: string;
  onPrimaryAction?: () => void;
  isActive?: boolean;
  defaultIcon?: string;
}

export function ActionForm({
  title,
  backAction = {
    content: "Actions",
    onAction: () => {},
  },
  children,
  summaryContent,
  primaryActionContent = "Create",
  onPrimaryAction = () => {},
  isActive = true,
  defaultIcon,
}: ActionFormProps) {
  const navigate = useNavigate();

  return (
    <Page
      backAction={backAction}
      title={title}
      primaryAction={{
        content: primaryActionContent,
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
            isActive={isActive}
            summaryContent={summaryContent}
            onStatusChange={(status) => {
              console.log("status changed", status);
            }}
          />
          <div className='mt-4'>
            <WaysToEarnIconCard
              isActive={isActive}
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
    </Page>
  );
}

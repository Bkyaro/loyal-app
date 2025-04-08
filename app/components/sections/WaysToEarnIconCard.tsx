import {
  Card,
  Text,
  Badge,
  ChoiceList,
  BlockStack,
  Link,
} from "@shopify/polaris";
interface WaysToEarnIconCardProps {
  isCustomIcon: boolean;
  customIcon: string;
  summaryContent: React.ReactNode;
  onSelectChange: (value: string) => void;
  defaultIcon?: string;
  CustomIconDescription: React.ReactNode;
  BottomDescription?: React.ReactNode;
}

export function WaysToEarnIconCard({
  isCustomIcon = false,
  customIcon = "",
  onSelectChange,
  defaultIcon,
  CustomIconDescription,
  BottomDescription = null,
}: WaysToEarnIconCardProps) {
  // customIcon为pro功能，等待迭代

  // 渲染图片
  const renderDefaultIcon = () =>
    defaultIcon ? (
      <img
        className='w-[60px] h-[60px] border border-gray-200 p-2 rounded-sm'
        src={defaultIcon}
        alt='default icon'
      />
    ) : null;

  return (
    <Card padding='0'>
      <div className='p-4'>
        <BlockStack gap='200'>
          <Text variant='headingMd' as='h2'>
            Icon
          </Text>
          <ChoiceList
            title='Icon'
            titleHidden
            selected={isCustomIcon ? ["custom"] : ["default"]}
            choices={[
              {
                label: "Default",
                value: "default",
                renderChildren: renderDefaultIcon,
              },
              {
                label: "Upload your own",
                value: "custom",
                renderChildren: () => CustomIconDescription,
              },
            ]}
            onChange={(selected) => onSelectChange(selected[0])}
          />
        </BlockStack>
      </div>
      {BottomDescription && (
        <div className='p-4 bg-[#F6F6F6]'>{BottomDescription}</div>
      )}
    </Card>
  );
}

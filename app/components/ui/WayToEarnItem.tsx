import {
  Text,
  Button,
  Box,
  InlineStack,
  BlockStack,
  Divider,
} from "@shopify/polaris";

interface WayToEarnItemProps {
  icon: string;
  iconSvg?: string;
  title: string;
  points: string;
  onEdit?: () => void;
  showDivider?: boolean;
}

export function WayToEarnItem({
  icon,
  iconSvg,
  title,
  points,
  onEdit = () => {},
  showDivider = true,
}: WayToEarnItemProps) {
  return (
    <>
      <div className='p-4'>
        <InlineStack align='space-between'>
          <InlineStack gap='400'>
            <div className='w-[40px] h-[40px] rounded-sm flex items-center justify-center bg-[#F4F6F8] border border-[#E0E0E0]'>
              {iconSvg ? (
                <img src={iconSvg} alt={title} className='w-[24px] h-[24px]' />
              ) : (
                icon
              )}
            </div>
            <BlockStack>
              <Text variant='bodyMd' as='p' fontWeight='semibold'>
                {title}
              </Text>
              <Text variant='bodySm' as='p' tone='subdued'>
                {points}
              </Text>
            </BlockStack>
          </InlineStack>
          <Button variant='plain' onClick={onEdit}>
            Edit
          </Button>
        </InlineStack>
      </div>
      {showDivider && <Divider />}
    </>
  );
}

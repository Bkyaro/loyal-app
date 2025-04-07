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
  title: string;
  points: string;
  onEdit?: () => void;
  showDivider?: boolean;
}

export function WayToEarnItem({
  icon,
  title,
  points,
  onEdit = () => {},
  showDivider = true,
}: WayToEarnItemProps) {
  return (
    <>
      <Box paddingBlockStart='400' paddingBlockEnd='400'>
        <InlineStack align='space-between'>
          <InlineStack gap='400'>
            <div
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F4F6F8",
                borderRadius: "8px",
              }}
            >
              {icon}
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
      </Box>
      {showDivider && <Divider />}
    </>
  );
}

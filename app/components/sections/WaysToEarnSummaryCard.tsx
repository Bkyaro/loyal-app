import { Card, Text, Badge, ChoiceList, BlockStack } from "@shopify/polaris";

interface WaysToEarnSummaryCardProps {
  isActive: boolean;
  summaryContent: React.ReactNode;
  onStatusChange: (status: "active" | "disabled") => void;
}

export function WaysToEarnSummaryCard({
  isActive,
  summaryContent,
  onStatusChange,
}: WaysToEarnSummaryCardProps) {
  return (
    <Card padding='0'>
      <div className='flex justify-between items-center p-4 pb-0'>
        <Text variant='headingMd' as='h2'>
          Summary
        </Text>
        {isActive ? (
          <Badge tone='success'>Active</Badge>
        ) : (
          <Badge tone='info'>Disabled</Badge>
        )}
      </div>
      <div id='summary-content' className='p-4 pb-0'>
        {summaryContent}
      </div>
      <div className='p-4 bg-[#F6F6F6]'>
        <BlockStack gap='200'>
          <Text variant='headingMd' as='h2'>
            Status
          </Text>
          <ChoiceList
            title='Status'
            titleHidden
            choices={[
              { label: "Active", value: "active" },
              { label: "Disabled", value: "disabled" },
            ]}
            selected={isActive ? ["active"] : ["disabled"]}
            onChange={(selected) =>
              onStatusChange(selected[0] as "active" | "disabled")
            }
          />
        </BlockStack>
      </div>
    </Card>
  );
}

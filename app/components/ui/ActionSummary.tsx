import { Text } from "@shopify/polaris";
import { ReactNode } from "react";

interface SummaryItemProps {
  children: ReactNode;
}

// Individual summary item with bullet point
export function SummaryItem({ children }: SummaryItemProps) {
  return (
    <li className='mb-2'>
      <Text variant='bodyMd' as='span'>
        {children}
      </Text>
    </li>
  );
}

interface ActionSummaryProps {
  items: ReactNode[];
}

// Wrapper component for consistent summary display
export function ActionSummary({ items }: ActionSummaryProps) {
  return (
    <ul className='list-disc pl-5'>
      {items.map((item, index) => (
        <SummaryItem key={index}>{item}</SummaryItem>
      ))}
    </ul>
  );
}

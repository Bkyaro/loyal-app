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
  // 如果items为空数组或者没有有效内容的item，则不渲染任何内容
  if (!items || items.length === 0) {
    return null;
  }

  const validItems = items.filter((item) => item);

  return (
    validItems.length && (
      <ul className='list-disc pl-5'>
        {validItems.map((item, index) => (
          <SummaryItem key={index}>{item}</SummaryItem>
        ))}
      </ul>
    )
  );
}

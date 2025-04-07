import { useState } from "react";
import {
  Page,
  Card,
  Tabs,
  Layout,
  Text,
  Button,
  Box,
  InlineStack,
  BlockStack,
  Divider,
  Link,
  Badge,
} from "@shopify/polaris";
import { WayToEarnItem } from "~/components/ui/WayToEarnItem";

export default function AppProgram() {
  const [selected, setSelected] = useState(0);

  const tabs = [
    {
      id: "points",
      content: "Points",
      accessibilityLabel: "Points",
      panelID: "points-panel",
    },
    {
      id: "referrals",
      content: "Referrals",
      accessibilityLabel: "Referrals",
      panelID: "referrals-panel",
    },
    {
      id: "vip",
      content: "VIP",
      accessibilityLabel: "VIP",
      panelID: "vip-panel",
    },
    {
      id: "activity",
      content: "Activity",
      accessibilityLabel: "Activity",
      panelID: "activity-panel",
    },
    {
      id: "bonus-campaigns",
      content: "Bonus Campaigns",
      accessibilityLabel: "Bonus Campaigns",
      panelID: "bonus-campaigns-panel",
    },
  ];

  const handleTabChange = (selectedTabIndex: number) => {
    setSelected(selectedTabIndex);
  };

  return (
    <Page>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        {selected === 0 && <PointsTab />}
        {selected === 1 && <div>Referrals content</div>}
        {selected === 2 && <div>VIP content</div>}
        {selected === 3 && <div>Activity content</div>}
        {selected === 4 && <div>Bonus Campaigns content</div>}
      </Tabs>
    </Page>
  );
}

function PointsTab() {
  const waysToEarn = [
    {
      id: 1,
      icon: "🛍️",
      title: "Place an order",
      points: "3 Points for every ¥1 spent",
    },
    {
      id: 2,
      icon: "🎂",
      title: "Celebrate a birthday",
      points: "200 Points",
    },
    {
      id: 3,
      icon: "📱",
      title: "Follow on TikTok",
      points: "50 Points",
    },
    {
      id: 4,
      icon: "📝",
      title: "Signup",
      points: "200 Points",
    },
    {
      id: 5,
      icon: "✖️",
      title: "Share on X",
      points: "1 Point",
    },
  ];

  return (
    <BlockStack gap='500'>
      <InlineStack align='space-between'>
        <InlineStack gap='200' align='center'>
          <Text variant='headingLg' as='h2'>
            Points
          </Text>
          <Badge tone='success'>Active</Badge>
        </InlineStack>
      </InlineStack>

      <Layout>
        <Layout.Section variant='oneThird'>
          <Card>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h3'>
                Earn points
              </Text>
              <Text variant='bodyMd' as='p'>
                Create ways your customers can earn points when they join,
                share, and engage with your brand. Learn more about{" "}
                <Link url='#'>how customers earn points</Link>.
              </Text>
              <div>
                <Button variant='primary' onClick={() => {}} size='slim'>
                  Add ways to earn
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap='400'>
              <InlineStack align='space-between'>
                <Text variant='headingMd' as='h3'>
                  Ways to earn
                </Text>
                <Link url='#'>View all ways to earn</Link>
              </InlineStack>

              {waysToEarn.map((way, index) => (
                <WayToEarnItem
                  key={way.id}
                  icon={way.icon}
                  title={way.title}
                  points={way.points}
                  showDivider={index < waysToEarn.length - 1}
                />
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </BlockStack>
  );
}

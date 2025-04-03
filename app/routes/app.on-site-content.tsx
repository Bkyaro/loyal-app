import { useState } from "react";
import { Page, Card, Text, Button, Grid } from "@shopify/polaris";

// 引入图片
import launcherImage from "../assets/on-stie-content/launcher.svg";
import panelImage from "../assets/on-stie-content/panel.svg";
import nudgesImage from "../assets/on-stie-content/nudges.svg";
import landingPageImage from "../assets/on-stie-content/landing-page.svg";
import pointsOnProductImage from "../assets/on-stie-content/points-on-product-page.svg";
import pointsOnAccountImage from "../assets/on-stie-content/points-on-account-page.svg";
import redeemAtCheckoutImage from "../assets/on-stie-content/points-redemption-at-checkout.svg";
import showPointsAtCheckoutImage from "../assets/on-stie-content/points-balance-at-checkout.svg";
import pointsAfterPurchaseImage from "../assets/on-stie-content/points-after-purchase.svg";

// 定义卡片数据类型
interface CardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonAction: "customize" | "setup";
}

export default function OnSiteContent() {
  // 模拟数据 - 站内内容
  const onSiteItems: CardItem[] = [
    {
      id: "launcher",
      title: "Launcher",
      description:
        "Define the content and appearance of the floating button on your site.",
      image: launcherImage,
      buttonText: "Customize",
      buttonAction: "customize",
    },
    {
      id: "panel",
      title: "Panel",
      description:
        "Modify and refine the content of your reward panel to fit your brand.",
      image: panelImage,
      buttonText: "Customize",
      buttonAction: "customize",
    },
    {
      id: "nudges",
      title: "Nudges",
      description: "Send on-site reminders to increase program engagement.",
      image: nudgesImage,
      buttonText: "Customize",
      buttonAction: "customize",
    },
  ];

  // 模拟数据 - 嵌入式内容
  const embeddedItems: CardItem[] = [
    {
      id: "landing-page",
      title: "Landing page",
      description: "Promote your loyalty program with a dedicated page.",
      image: landingPageImage,
      buttonText: "Setup",
      buttonAction: "setup",
    },
    {
      id: "points-on-product",
      title: "Points on product page",
      description: "Show shoppers the points they'll earn from a purchase.",
      image: pointsOnProductImage,
      buttonText: "Setup",
      buttonAction: "setup",
    },
    {
      id: "points-on-account",
      title: "Points on account page",
      description: "Show shoppers their points balance on their account page.",
      image: pointsOnAccountImage,
      buttonText: "Setup",
      buttonAction: "setup",
    },
    {
      id: "redeem-at-checkout",
      title: "Redeem at checkout",
      description: "Make it easy for shoppers to redeem rewards at checkout.",
      image: redeemAtCheckoutImage,
      buttonText: "Setup",
      buttonAction: "setup",
    },
    {
      id: "show-points-at-checkout",
      title: "Show points at checkout",
      description:
        "Show shoppers the points they'll earn from a purchase at checkout.",
      image: showPointsAtCheckoutImage,
      buttonText: "Setup",
      buttonAction: "setup",
    },
    {
      id: "points-after-purchase",
      title: "Points after purchase",
      description:
        "Show shoppers that they've earned points after their purchase.",
      image: pointsAfterPurchaseImage,
      buttonText: "Setup",
      buttonAction: "setup",
    },
  ];

  return (
    <Page>
      <div className='pb-16'>
        {/* 站内内容部分 */}
        <div className='mb-8'>
          <div className='mb-4'>
            <Text as='h2' variant='headingLg'>
              On-site content
            </Text>
            <Text as='p' variant='bodyMd' tone='subdued'>
              Our on-site content features are designed to make your loyalty
              program visible, engaging, and easy for your shoppers to use.
            </Text>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {onSiteItems.map((item) => (
              <div key={item.id} className='w-full'>
                <Card>
                  <div className='h-full'>
                    <div className='flex h-full items-center justify-between'>
                      {/* 左侧: 文本和按钮 */}
                      <div className='flex-1 pr-4 flex flex-col justify-between h-full min-w-0'>
                        <div>
                          <Text as='h2' variant='headingMd'>
                            {item.title}
                          </Text>
                          <div className='mt-1'>
                            <Text
                              fontWeight='regular'
                              as='p'
                              variant='bodyMd'
                              tone='subdued'
                            >
                              {item.description}
                            </Text>
                          </div>
                        </div>
                        <div className='mt-4'>
                          <Button
                            variant='secondary'
                            onClick={() =>
                              console.log(
                                `${item.buttonAction} clicked for ${item.id}`,
                              )
                            }
                          >
                            {item.buttonText}
                          </Button>
                        </div>
                      </div>

                      {/* 右侧: 图片 */}
                      <div className='flex-none flex items-center justify-end w-[120px]'>
                        <img
                          src={item.image}
                          alt={item.title}
                          className='max-h-full max-w-full object-contain'
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* 嵌入式内容部分 */}
        <div className='mt-4'>
          <div className='mb-4'>
            <Text as='h2' variant='headingMd'>
              Embedded content
            </Text>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {embeddedItems.map((item) => (
              <div key={item.id} className='w-full'>
                <Card>
                  <div className=''>
                    <div className='flex items-center justify-between'>
                      {/* 左侧: 文本和按钮 */}
                      <div className='flex-1 pr-4 flex flex-col justify-between h-full min-w-0'>
                        <div>
                          <Text as='h2' variant='headingMd'>
                            {item.title}
                          </Text>
                          <div className='mt-1'>
                            <Text
                              fontWeight='regular'
                              as='p'
                              variant='bodyMd'
                              tone='subdued'
                            >
                              {item.description}
                            </Text>
                          </div>
                        </div>
                        <div className='mt-4'>
                          <Button
                            variant='secondary'
                            onClick={() =>
                              console.log(
                                `${item.buttonAction} clicked for ${item.id}`,
                              )
                            }
                          >
                            {item.buttonText}
                          </Button>
                        </div>
                      </div>

                      {/* 右侧: 图片 */}
                      <div className='flex-none flex items-center justify-end w-[120px]'>
                        <img
                          src={item.image}
                          alt={item.title}
                          className='max-h-full max-w-full object-contain'
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

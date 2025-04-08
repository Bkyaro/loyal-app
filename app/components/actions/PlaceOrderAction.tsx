import { useState } from "react";
import {
  Card,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  RadioButton,
} from "@shopify/polaris";
import { ActionForm } from "~/components/ui/ActionForm";
import { ActionSummary } from "~/components/ui/ActionSummary";
import { useNavigate } from "@remix-run/react";
import orderOnlineSvg from "~/assets/program/ways-to-earn/order-online.svg";

export function PlaceOrderAction() {
  const [earningType, setEarningType] = useState<string>("increments");
  const [pointsValue, setPointsValue] = useState<string>("1");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/app/program/points/actions");
  };

  const handleCreateAction = () => {
    console.log("Creating place order action with", {
      earningType,
      pointsValue,
    });
    // todo: 调用创建API
  };

  // Summary content using the shared component
  const summaryContent = (
    <ActionSummary
      items={[
        earningType === "increments"
          ? `Customers earn ${pointsValue} point for every ¥1 spent`
          : `${pointsValue} points for completing action`,
      ]}
    />
  );

  return (
    <ActionForm
      title='Place an order'
      backAction={{
        content: "Actions",
        onAction: handleBackClick,
      }}
      onPrimaryAction={handleCreateAction}
      summaryContent={summaryContent}
      defaultIcon={orderOnlineSvg}
    >
      <Card>
        <div className='p-4'>
          <BlockStack gap='400'>
            <Text variant='headingMd' as='h2'>
              Earning type
            </Text>
            <div>
              <RadioButton
                label='Increments of points (recommended)'
                checked={earningType === "increments"}
                id='increments'
                name='earningType'
                onChange={() => setEarningType("increments")}
              />
              <div className='mt-2'>
                <RadioButton
                  label='Fixed amount of points'
                  checked={earningType === "fixed"}
                  id='fixed'
                  name='earningType'
                  onChange={() => setEarningType("fixed")}
                />
              </div>
            </div>
          </BlockStack>
        </div>
      </Card>

      <div className='mt-4'>
        <Card>
          <div className='p-4'>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h2'>
                Earning value
              </Text>
              <div>
                <Text variant='bodyMd' as='p'>
                  {earningType === "increments"
                    ? "Points earned for every ¥1 spent"
                    : "Points awarded"}
                </Text>
                <div className='mt-2'>
                  <TextField
                    label='Points'
                    labelHidden
                    value={pointsValue}
                    onChange={setPointsValue}
                    autoComplete='off'
                    type='number'
                    suffix={earningType === "increments" ? "point" : "points"}
                  />
                </div>
              </div>
              {earningType === "increments" && (
                <div className='text-sm bg-[#FAFBFB]'>
                  Limit the number of times each customer can earn points for
                  this action.
                  <a href='#' className='text-[#006FBB] ml-1'>
                    Upgrade now →
                  </a>
                </div>
              )}
            </BlockStack>
          </div>
        </Card>
      </div>

      <div className='mt-4'>
        <Card>
          <div className='p-4'>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h2'>
                Customer eligibility
              </Text>
              <Text variant='bodyMd' as='p'>
                Upgrade to tailor actions to specific customer conditions.
              </Text>
              <div>
                <InlineStack gap='400' blockAlign='center'>
                  <button className='bg-[#FAFBFB] border border-[#E1E3E5] rounded py-1 px-3 text-sm'>
                    Upgrade
                  </button>
                  <Text variant='bodyMd' as='span' fontWeight='medium'>
                    <a href='#' className='text-[#006FBB]'>
                      Learn more about customer eligibility
                    </a>
                  </Text>
                </InlineStack>
              </div>
            </BlockStack>
          </div>
        </Card>
      </div>

      <div className='mt-4'>
        <Card>
          <div className='p-4'>
            <BlockStack gap='400'>
              <InlineStack align='space-between'>
                <Text variant='headingMd' as='h2'>
                  Product eligibility
                </Text>
                <div className='ml-2 px-2 py-0.5 bg-[#E4E5E7] rounded text-xs'>
                  New
                </div>
              </InlineStack>
              <Text variant='bodyMd' as='p'>
                Exclude specific products from earning points
              </Text>
              <div>
                <button className='bg-[#FAFBFB] border border-[#E1E3E5] rounded py-1 px-3 text-sm'>
                  Manage exclusions
                </button>
              </div>
            </BlockStack>
          </div>
        </Card>
      </div>
    </ActionForm>
  );
}

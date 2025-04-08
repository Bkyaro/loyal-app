import { useState } from "react";
import {
  Card,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  List,
} from "@shopify/polaris";
import { ActionForm } from "~/components/ui/ActionForm";
import { ActionSummary } from "~/components/ui/ActionSummary";
import { useNavigate } from "@remix-run/react";
import birthdaySvg from "~/assets/program/ways-to-earn/birthday.svg";

export function BirthdayAction() {
  const [points, setPoints] = useState<string>("200");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/app/program/points/actions");
  };

  const handleCreateAction = () => {
    console.log("Creating birthday action with", { points });
    // todo: 调用创建API
  };

  // Summary content using the shared component
  const summaryContent = (
    <ActionSummary
      items={[
        `${points} points for completing action`,
        `Limit of 1 per year`,
        `Customers must enter their birthday in Smile UI at least 30 days in advance to be rewarded`,
      ]}
    />
  );

  return (
    <ActionForm
      title='Celebrate a birthday'
      backAction={{
        content: "Actions",
        onAction: handleBackClick,
      }}
      onPrimaryAction={handleCreateAction}
      summaryContent={summaryContent}
      defaultIcon={birthdaySvg}
    >
      <Card>
        <div className='p-4'>
          <BlockStack gap='400'>
            <Text variant='headingMd' as='h2'>
              Earning value
            </Text>
            <div>
              <Text variant='bodyMd' as='p'>
                Points awarded
              </Text>
              <div className='mt-2'>
                <TextField
                  label='Points'
                  labelHidden
                  value={points}
                  onChange={setPoints}
                  autoComplete='off'
                  type='number'
                  suffix='points'
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
              <Text variant='headingMd' as='h2'>
                Redemption limits
              </Text>
              <div>
                <Text variant='bodyMd' as='p'>
                  Limit of 1 per year
                </Text>
                <div className='mt-2'>
                  <Text variant='bodyMd' as='p' tone='subdued'>
                    Customers must enter their birthday in Smile UI at least 30
                    days in advance to be rewarded
                  </Text>
                </div>
              </div>
            </BlockStack>
          </div>
        </Card>
      </div>
    </ActionForm>
  );
}

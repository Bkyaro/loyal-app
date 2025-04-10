import {
  Text,
  Button,
  Box,
  InlineStack,
  BlockStack,
  Divider,
  Badge,
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";

interface PointsRuleItemProps {
  mode: "earn" | "redeem";
  id: number;
  isCustomIcon: boolean;
  customIcon?: string;
  iconSvg?: string;
  title: string;
  points: number;
  onEdit?: () => void;
  showDivider?: boolean;
  totalRewarded?: number;
  active?: boolean;
  description: string;
  cost?: string;
}

export function PointsRuleItem({
  mode,
  id,
  isCustomIcon,
  customIcon,
  iconSvg,
  title,
  points,
  onEdit,
  showDivider = true,
  totalRewarded = 0,
  active = false,
  description,
  cost,
}: PointsRuleItemProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    // 点击跳转编辑页
    if (mode === "earn") {
      navigate(`/app/program/points/actions/${id}`);
    } else {
      navigate(`/app/program/points/rewards/${id}`);
    }
  };

  return (
    <>
      <div
        className='w-full p-4 cursor-pointer hover:bg-[#F6F6F6] flex items-center'
        onClick={handleEdit}
      >
        <div className='shrink-0 flex w-[40px] h-[40px] rounded-sm items-center justify-center bg-[#fff] border border-[#E0E0E0] mr-4'>
          <img
            src={isCustomIcon ? customIcon : iconSvg}
            alt={title}
            className='w-[24px] h-[24px]'
          />
        </div>
        <div className='flex justify-between items-center flex-1'>
          <p className='font-semibold text-base basis-[35%]'>{title}</p>
          <div className='basis-[15%]'>
            {active ? (
              <Badge tone='success'>Active</Badge>
            ) : (
              <Badge tone='info'>Disabled</Badge>
            )}
          </div>
          {/* 兑换描述 */}
          <p className='text-sm text-gray-500 basis-[30%]'>
            {description && `${description}`}
          </p>
          {mode === "redeem" && (
            <p className='text-sm text-gray-500 basis-[20%]'>
              {cost && `${cost}`}
            </p>
          )}
          <p className='text-base text-gray-500 basis-[20%]'>
            {totalRewarded} rewarded
          </p>
        </div>
      </div>
      {showDivider && <Divider />}
    </>
  );
}

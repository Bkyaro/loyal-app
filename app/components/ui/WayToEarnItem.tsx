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

interface WayToEarnItemProps {
  id: number;
  icon: string;
  iconSvg?: string;
  title: string;
  points: string;
  onEdit?: () => void;
  showDivider?: boolean;
  totalRewarded?: number;
  active?: boolean;
}

export function WayToEarnItem({
  id,
  icon,
  iconSvg,
  title,
  points,
  onEdit,
  showDivider = true,
  totalRewarded = 0,
  active = false,
}: WayToEarnItemProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    // 点击跳转编辑页
    navigate(`/app/program/points/actions/${id}`);
  };

  return (
    <>
      <div
        className='w-full p-4 cursor-pointer hover:bg-[#F6F6F6] flex'
        onClick={handleEdit}
      >
        <div className='flex w-[40px] h-[40px] rounded-sm items-center justify-center bg-[#fff] border border-[#E0E0E0] mr-4'>
          {iconSvg ? (
            <img src={iconSvg} alt={title} className='w-[24px] h-[24px]' />
          ) : (
            icon
          )}
        </div>
        <div className='flex justify-between items-center flex-1'>
          <p className='font-semibold text-base basis-[30%]'>{title}</p>
          <div className='basis-[15%]'>
            {active ? (
              <Badge tone='success'>Active</Badge>
            ) : (
              <Badge tone='info'>Disabled</Badge>
            )}
          </div>
          <p className='text-sm text-gray-500 basis-[35%]'>{points}</p>
          <p className='text-base text-gray-500 basis-[20%]'>
            {totalRewarded} rewarded
          </p>
        </div>
      </div>
      {showDivider && <Divider />}
    </>
  );
}

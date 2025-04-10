import { Link } from "@shopify/polaris";

interface PointsConfigListItemProps {
  mode: "earn" | "redeem";
  id: number;
  isCustomIcon: boolean;
  customIcon?: string;
  iconSvg?: string;
  title: string;
  points: number;
  onClick?: () => void;
  active?: boolean;
  description: string;
}

export function PointsConfigListItem({
  mode,
  id,
  isCustomIcon,
  customIcon = "",
  iconSvg = "",
  title,
  active = false,
  description,
}: PointsConfigListItemProps) {
  return (
    <>
      {active && (
        <div className='w-full px-4 flex items-center'>
          <div className='shrink-0 flex w-[40px] h-[40px] rounded-sm items-center justify-center bg-[#EBEEFA] border border-[#E0E0E0] mr-4'>
            <img
              src={isCustomIcon ? customIcon : iconSvg}
              alt={title}
              className='w-[24px] h-[24px]'
            />
          </div>
          <div className='flex  items-center justify-between w-full'>
            <div className='h-full '>
              <div className='text-base'>{title}</div>
              {/* 兑换描述 */}
              <div className='text-sm text-gray-500 '>
                {description && `${description}`}
              </div>
            </div>
            <Link
              url={
                mode === "earn"
                  ? `/app/program/points/actions/${id}`
                  : `/app/program/points/rewards/${id}`
              }
              removeUnderline
            >
              Edit
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

import { Link } from "@shopify/polaris";

interface PointsConfigListItemProps {
  id: number;
  icon: string;
  iconSvg?: string;
  title: string;
  points: number;
  onClick?: () => void;
  active?: boolean;
  description: string;
}

export function PointsConfigListItem({
  id,
  icon,
  iconSvg,
  title,
  active = false,
  description,
}: PointsConfigListItemProps) {
  return (
    <>
      {active && (
        <div className='w-full px-4 flex items-center'>
          <div className='shrink-0 flex w-[40px] h-[40px] rounded-sm items-center justify-center bg-[#EBEEFA] border border-[#E0E0E0] mr-4'>
            {iconSvg ? (
              <img src={iconSvg} alt={title} className='w-[24px] h-[24px]' />
            ) : (
              icon
            )}
          </div>
          <div className='flex  items-center justify-between w-full'>
            <div className='h-full '>
              <div className='text-base'>{title}</div>
              {/* 兑换描述 */}
              <div className='text-sm text-gray-500 '>
                {description && `${description}`}
              </div>
            </div>
            <Link url={`/app/program/points/actions/${id}`} removeUnderline>
              Edit
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

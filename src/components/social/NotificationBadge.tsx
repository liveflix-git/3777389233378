import React from 'react';

interface NotificationBadgeProps {
  count?: number | string;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count = 6,
  className = '',
}) => {
  return (
    <span
      className={`absolute -top-[6px] -right-[7px] min-w-[18px] h-[18px] px-[4px] rounded-full bg-[#FF3040] text-white text-[10px] font-bold leading-none flex items-center justify-center border-[2px] border-[#080B0E] pointer-events-none select-none ${className}`}
    >
      {count}
    </span>
  );
};

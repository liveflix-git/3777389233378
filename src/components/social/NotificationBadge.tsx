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
      className={`absolute -top-[4px] -right-[6px] min-w-[16px] h-[16px] px-[3px] rounded-full bg-[#FF3040] text-white text-[10px] font-bold leading-none flex items-center justify-center border-[1.5px] border-[#080B0E] pointer-events-none select-none z-10 ${className}`}
    >
      {count}
    </span>
  );
};

import React from 'react';
import { ActivityItem, ActivityItemData } from './ActivityItem';

interface ActivitySectionProps {
  title: string;
  items: ActivityItemData[];
  onItemClick: (item: ActivityItemData) => void;
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({
  title,
  items,
  onItemClick,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full space-y-2 select-none mb-6">
      <h3 className="text-base sm:text-lg font-bold text-white font-display px-1 text-left">
        {title}
      </h3>

      <div className="space-y-1">
        {items.map((item) => (
          <ActivityItem
            key={item.id}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

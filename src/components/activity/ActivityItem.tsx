import React from 'react';
import { Lock } from 'lucide-react';

export interface ActivityItemData {
  id: string;
  avatarSrc?: string;
  stackedAvatars?: string[];
  hasLockOverlay?: boolean;
  usernamePrefix?: string;
  actionText: string;
  highlightText?: string;
  timestamp: string;
  rightThumbnail?: string;
  buttonLabel?: string;
  buttonVariant?: 'gray' | 'blue';
}

interface ActivityItemProps {
  item: ActivityItemData;
  onClick: () => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      data-origin="ui-preview"
      className="w-full flex items-center justify-between gap-3 py-3 px-1 hover:bg-white/[0.03] rounded-xl transition-colors cursor-pointer select-none border-b border-white/[0.04] last:border-b-0"
    >
      {/* Left Avatar / Stacked Avatars */}
      <div className="shrink-0 relative">
        {item.stackedAvatars && item.stackedAvatars.length > 0 ? (
          <div className="relative w-11 h-11">
            <img
              src={item.stackedAvatars[0]}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover filter blur-[7px] border border-black/50 absolute top-0 left-0"
            />
            <img
              src={item.stackedAvatars[1] || item.stackedAvatars[0]}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover filter blur-[7px] border border-black/50 absolute bottom-0 right-0 shadow-md"
            />
          </div>
        ) : (
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center">
            <img
              src={
                item.avatarSrc ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
              }
              alt="Avatar ativ"
              className="w-full h-full object-cover filter blur-[8px] scale-125"
            />
            {item.hasLockOverlay && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Lock className="w-4 h-4 text-white/90 drop-shadow-md" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Middle Text Block */}
      <div className="flex-1 min-w-0 text-left leading-tight">
        <p className="text-[13.5px] text-white/90 font-medium leading-snug break-words">
          {item.usernamePrefix && (
            <span className="font-bold text-white mr-1">
              {item.usernamePrefix}
            </span>
          )}
          <span>{item.actionText}</span>
          {item.highlightText && (
            <span className="font-bold text-white ml-1">
              {item.highlightText}
            </span>
          )}
          <span className="text-[12.5px] text-[#8E95A2] ml-2 shrink-0 font-normal">
            {item.timestamp}
          </span>
        </p>
      </div>

      {/* Right Element: Thumbnail OR Button */}
      <div className="shrink-0 flex items-center">
        {item.rightThumbnail ? (
          <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/10 bg-slate-800 relative">
            <img
              src={item.rightThumbnail}
              alt="Thumbnail"
              className="w-full h-full object-cover filter blur-[8px] scale-125"
            />
          </div>
        ) : item.buttonLabel ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs tracking-tight transition-all cursor-pointer ${
              item.buttonVariant === 'blue'
                ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-md'
                : 'bg-[#262E3B] hover:bg-[#323C4D] text-white'
            }`}
          >
            {item.buttonLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};

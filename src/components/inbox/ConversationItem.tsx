import React from 'react';
import { Camera } from 'lucide-react';

export interface ConversationData {
  id: string;
  avatarSrc: string;
  handle: string;
  previewMessage: string;
  timestamp: string;
  hasUnread?: boolean;
}

interface ConversationItemProps {
  conversation: ConversationData;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      data-origin="ui-preview"
      className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer select-none"
    >
      {/* Left Avatar */}
      <div className="relative shrink-0 w-[52px] h-[52px] rounded-full overflow-hidden bg-slate-800 border border-white/10">
        <img
          src={conversation.avatarSrc}
          alt={conversation.handle}
          className="w-full h-full object-cover filter blur-[8px] scale-125"
        />
      </div>

      {/* Middle Text: Handle & Last Message Preview */}
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-[14px] font-bold text-white tracking-tight leading-tight">
          {conversation.handle}
        </h4>
        <p className="text-[13px] text-[#A0A6B2] font-normal leading-tight mt-1 truncate">
          <span>{conversation.previewMessage}</span>
          <span className="mx-1">•</span>
          <span>{conversation.timestamp}</span>
        </p>
      </div>

      {/* Right Camera Icon */}
      <div className="shrink-0 text-[#8E95A2] hover:text-white transition-colors p-1">
        <Camera className="w-5 h-5 stroke-[1.8]" />
      </div>
    </div>
  );
};

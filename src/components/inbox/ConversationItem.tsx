import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';

export interface ConversationData {
  id: string;
  avatarSrc: string;
  handle: string;
  previewMessage: string;
  timestamp: string;
  isLocked?: boolean;
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
  const [imgErr, setImgErr] = useState(false);

  const rawSrc = conversation.avatarSrc;
  const finalSrc = rawSrc
    ? rawSrc.startsWith('/api/instagram/') || !rawSrc.startsWith('http')
      ? rawSrc
      : `/api/instagram/profile-image?url=${encodeURIComponent(rawSrc)}`
    : null;

  return (
    <div
      onClick={onClick}
      className="w-full min-h-[72px] flex items-center justify-between gap-[12px] px-4 py-[9px] hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors cursor-pointer select-none"
    >
      {/* Left Avatar (54px) */}
      <div className="relative shrink-0 w-[54px] h-[54px] rounded-full overflow-hidden bg-[#181D26] border border-white/10 flex items-center justify-center">
        {!imgErr && finalSrc ? (
          <img
            src={finalSrc}
            alt={conversation.handle}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#181D26] flex items-center justify-center text-[#737373]">
            <User className="w-6 h-6" />
          </div>
        )}

        {/* Small unread blue dot */}
        {conversation.hasUnread && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#3797F0] border-2 border-[#000000]" />
        )}
      </div>

      {/* Middle Text: Handle & Last Message Preview */}
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#F5F5F5] leading-tight truncate">
          {conversation.handle}
        </h4>
        <p className="text-[13px] text-[#A8A8A8] font-normal leading-tight mt-1 truncate">
          <span className={conversation.hasUnread ? 'text-white font-semibold' : 'text-[#A8A8A8]'}>
            {conversation.previewMessage}
          </span>
          <span className="text-[#737373] ml-1">· {conversation.timestamp}</span>
        </p>
      </div>

      {/* Right Camera Icon (Instagram style, 23px, stroke #A8A8A8) */}
      <div className="shrink-0 text-[#A8A8A8] hover:text-white transition-colors p-1">
        <Camera className="w-[23px] h-[23px] stroke-[1.8]" />
      </div>
    </div>
  );
};

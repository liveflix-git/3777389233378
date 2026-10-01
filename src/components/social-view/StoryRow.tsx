import React, { useState } from 'react';
import { Lock, Eye } from 'lucide-react';
import type { DataOrigin } from '../../services/instagramProfile';

interface StoryItem {
  id: string;
  origin: DataOrigin;
  maskedName: string;
}

interface StoryRowProps {
  mainProfilePic?: string | null;
  mainUsername: string;
  onStoryClick?: () => void;
}

export const StoryRow: React.FC<StoryRowProps> = ({
  mainProfilePic,
  mainUsername,
  onStoryClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Masked story placeholders strictly marked as placeholder UI
  const maskedStories: StoryItem[] = [
    { id: '1', origin: 'placeholder', maskedName: 'a******' },
    { id: '2', origin: 'placeholder', maskedName: 'bia*****' },
    { id: '3', origin: 'placeholder', maskedName: 'luc*****' },
    { id: '4', origin: 'placeholder', maskedName: 'car*****' },
    { id: '5', origin: 'placeholder', maskedName: 'fer*****' },
    { id: '6', origin: 'placeholder', maskedName: 'd******' },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-3.5 px-4 border-b border-neutral-900 bg-[#000000] select-none">
      <div className="flex items-center gap-[14px] min-w-max">
        
        {/* 1. Main Profile Story Circle (Real profile data) */}
        <div 
          onClick={onStoryClick}
          className="flex flex-col items-center gap-1.5 cursor-pointer group"
        >
          <div className="relative w-[70px] h-[70px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_0_12px_rgba(221,42,123,0.25)] transition-transform duration-200 group-hover:scale-105 active:scale-95">
            <div className="w-full h-full rounded-full bg-black p-[2px] overflow-hidden flex items-center justify-center">
              {!imgError && mainProfilePic ? (
                <img
                  src={mainProfilePic}
                  alt={`Story de @${mainUsername}`}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover rounded-full bg-neutral-900"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                  <Eye className="w-7 h-7 text-[#60A5FA]" />
                </div>
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#F5F5F5] font-normal truncate max-w-[70px] text-center tracking-tight">
            Seu story
          </span>
        </div>

        {/* 2. Masked / Locked Stories (Visualmente convincentes) */}
        {maskedStories.map((story, idx) => (
          <div
            key={story.id}
            onClick={onStoryClick}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="relative w-[70px] h-[70px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] transition-transform duration-200 group-hover:scale-105 active:scale-95">
              <div className="relative w-full h-full rounded-full bg-black p-[2px] overflow-hidden flex items-center justify-center">
                {/* Synthetic heavily blurred aesthetic background */}
                <div 
                  className={`w-full h-full scale-125 ${
                    idx % 3 === 0
                      ? 'bg-gradient-to-br from-purple-950 via-indigo-950 to-neutral-950'
                      : idx % 3 === 1
                      ? 'bg-gradient-to-br from-rose-950 via-pink-950 to-neutral-950'
                      : 'bg-gradient-to-br from-blue-950 via-indigo-950 to-neutral-950'
                  }`}
                  style={{ filter: 'blur(14px) brightness(0.45)' }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white drop-shadow" />
                </div>
              </div>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono-tech truncate max-w-[70px] text-center tracking-tight">
              {story.maskedName}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

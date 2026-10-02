import React, { useState } from 'react';
import { Lock, Plus, User } from 'lucide-react';
import type { RelatedProfileItem } from '../../services/instagramProfile';
import { getProxiedImageUrl } from '../../utils/imageHelper';

function maskUsername(username: string): string {
  if (!username) return '***';
  const clean = username.trim().replace(/^@/, '');
  if (clean.length <= 2) {
    return clean + '***';
  }
  return clean.slice(0, 3) + '***';
}

interface RealStoryCircleProps {
  username: string;
  profilePicture: string | null;
  isCloseFriends?: boolean;
  onClick: () => void;
}

const RealStoryCircle: React.FC<RealStoryCircleProps> = ({
  username,
  profilePicture,
  isCloseFriends,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(profilePicture);
  const [proxyTried, setProxyTried] = useState(false);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgSrc(profilePicture);
    setProxyTried(false);
    setImgError(false);
  }, [profilePicture]);

  const handleImgError = () => {
    if (!proxyTried && imgSrc && !imgSrc.startsWith('/api/instagram/')) {
      setProxyTried(true);
      setImgSrc(getProxiedImageUrl(imgSrc));
    } else {
      setImgError(true);
    }
  };

  const maskedName = maskUsername(username);

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
    >
      <div
        className={`relative w-[70px] h-[70px] rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 active:scale-95 ${
          isCloseFriends
            ? 'bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.3)]'
            : 'bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA]'
        }`}
      >
        <div className="w-full h-full rounded-full bg-[#080B0E] p-[2px] overflow-hidden flex items-center justify-center">
          {!imgError && imgSrc ? (
            <img
              src={imgSrc}
              alt={`Story de @${username}`}
              onError={handleImgError}
              className="w-full h-full object-cover rounded-full bg-neutral-900"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <User className="w-6 h-6 text-neutral-400" />
            </div>
          )}
        </div>
      </div>
      <span className="text-[11.5px] text-[#C4C7CF] font-sans font-normal truncate max-w-[74px] text-center tracking-tight leading-tight group-hover:text-white transition-colors">
        {maskedName}
      </span>
    </div>
  );
};

export interface SocialStoriesRowProps {
  mainProfilePic?: string | null;
  mainUsername: string;
  relatedProfiles?: RelatedProfileItem[] | null;
  onStoryClick: () => void;
}

export const SocialStoriesRow: React.FC<SocialStoriesRowProps> = ({
  mainProfilePic,
  mainUsername,
  relatedProfiles,
  onStoryClick,
}) => {
  const [mainImgErr, setMainImgErr] = useState(false);
  const [mainProxyTried, setMainProxyTried] = useState(false);
  const [mainPicSrc, setMainPicSrc] = useState<string | null>(mainProfilePic || null);

  React.useEffect(() => {
    setMainPicSrc(mainProfilePic || null);
    setMainImgErr(false);
    setMainProxyTried(false);
  }, [mainProfilePic]);

  const handleMainImgError = () => {
    if (!mainProxyTried && mainPicSrc && !mainPicSrc.startsWith('/api/instagram/')) {
      setMainProxyTried(true);
      setMainPicSrc(getProxiedImageUrl(mainPicSrc));
    } else {
      setMainImgErr(true);
    }
  };

  // Filter valid real related profiles from Apify provider data
  const realRelatedProfiles = (relatedProfiles || []).filter(
    (p) => p && typeof p.username === 'string' && p.username.trim().length > 0
  );

  // Target 6 story slots after "Seu story"
  const TARGET_SLOTS = 6;
  const realCount = Math.min(realRelatedProfiles.length, TARGET_SLOTS);
  const placeholderCount = TARGET_SLOTS - realCount;

  // We want Close Friends (Green) stories first, then normal stories (Pink/Purple)
  // Partition: 3 Close Friends stories followed by 3 Regular stories
  const CLOSE_FRIENDS_TARGET = 3;

  interface StoryData {
    id: string;
    username: string;
    profilePicture?: string | null;
    isCloseFriends: boolean;
    isPlaceholder: boolean;
    bgGradientIdx?: number;
  }

  const allStories: StoryData[] = [];

  // Add real profiles
  for (let i = 0; i < realCount; i++) {
    const p = realRelatedProfiles[i];
    allStories.push({
      id: `real-${p.username}-${i}`,
      username: p.username,
      profilePicture: p.profilePicture,
      isCloseFriends: i < CLOSE_FRIENDS_TARGET,
      isPlaceholder: false,
    });
  }

  // Add placeholder slots
  const fallbackNames = ['car***', 'fer***', 'jp***', 'luc***', 'gab***', 'isa***'];
  for (let i = 0; i < placeholderCount; i++) {
    const totalIndex = realCount + i;
    allStories.push({
      id: `placeholder-${i}`,
      username: fallbackNames[i % fallbackNames.length],
      profilePicture: null,
      isCloseFriends: totalIndex < CLOSE_FRIENDS_TARGET,
      isPlaceholder: true,
      bgGradientIdx: i,
    });
  }

  // Sort strictly: Green stories (isCloseFriends === true) FIRST, then Pink/Purple stories
  const sortedStories = [...allStories].sort((a, b) => {
    if (a.isCloseFriends === b.isCloseFriends) return 0;
    return a.isCloseFriends ? -1 : 1;
  });

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-[14px] px-[14px] border-b border-[#24282E]/30 bg-[#080B0E] select-none">
      <div className="flex items-center gap-[14px] min-w-max">
        
        {/* 1. Main Profile Story Circle ("Seu story") */}
        <div
          onClick={onStoryClick}
          className="flex flex-col items-center gap-1.5 cursor-pointer group"
        >
          <div className="relative w-[70px] h-[70px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA] shadow-[0_0_12px_rgba(236,72,153,0.22)] transition-transform duration-200 group-hover:scale-105 active:scale-95">
            <div className="w-full h-full rounded-full bg-[#080B0E] p-[2px] overflow-hidden flex items-center justify-center">
              {!mainImgErr && mainPicSrc ? (
                <img
                  src={mainPicSrc}
                  alt={`Story de @${mainUsername}`}
                  onError={handleMainImgError}
                  className="w-full h-full object-cover rounded-full bg-neutral-900"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                  <User className="w-6 h-6 text-neutral-400" />
                </div>
              )}
            </div>

            {/* "+" badge overlay on bottom right */}
            <div className="absolute bottom-0 right-0 w-[17px] h-[17px] rounded-full bg-[#0095F6] border-[1.5px] border-[#080B0E] flex items-center justify-center text-white shadow-sm">
              <Plus className="w-2.5 h-2.5 stroke-[3.5]" />
            </div>
          </div>

          <span className="text-[11.5px] text-[#F5F5F5] font-sans font-medium truncate max-w-[74px] text-center tracking-tight leading-tight">
            Seu story
          </span>
        </div>

        {/* 2. Sorted Stories (Green/Melhores Amigos FIRST, then Pink/Purple) */}
        {sortedStories.map((story) => {
          if (!story.isPlaceholder) {
            return (
              <RealStoryCircle
                key={story.id}
                username={story.username}
                profilePicture={story.profilePicture || null}
                isCloseFriends={story.isCloseFriends}
                onClick={onStoryClick}
              />
            );
          }

          const maskedName = maskUsername(story.username);
          const bgIdx = story.bgGradientIdx ?? 0;

          return (
            <div
              key={story.id}
              onClick={onStoryClick}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className={`relative w-[70px] h-[70px] rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 active:scale-95 ${
                story.isCloseFriends
                  ? 'bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                  : 'bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA]'
              }`}>
                <div className="relative w-full h-full rounded-full bg-[#080B0E] p-[2px] overflow-hidden flex items-center justify-center">
                  <div
                    className={`w-full h-full scale-125 ${
                      bgIdx % 3 === 0
                        ? 'bg-gradient-to-br from-purple-950/80 via-indigo-950/90 to-neutral-950'
                        : bgIdx % 3 === 1
                        ? 'bg-gradient-to-br from-rose-950/80 via-pink-950/90 to-neutral-950'
                        : 'bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-neutral-950'
                    }`}
                    style={{ filter: 'blur(10px) brightness(0.4)' }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white drop-shadow" />
                  </div>
                </div>
              </div>
              <span className="text-[11.5px] text-[#C4C7CF] font-sans font-normal truncate max-w-[74px] text-center tracking-tight leading-tight group-hover:text-white transition-colors">
                {maskedName}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Lock, Plus, User } from 'lucide-react';
import type { RelatedInstagramProfile } from '../../services/instagramProfile';
import { getProxiedInstagramImage } from '../../utils/imageHelper';

export const FREE_STORY_LIMIT = 3;

export function maskUsername(username: string): string {
  if (!username) return '******';
  const clean = username.trim().replace(/^@/, '');
  if (clean.length <= 3) {
    return clean + '*****';
  }
  return clean.slice(0, 3) + '*****';
}

// Neutral placeholder profiles when real profiles < 7 or private (strictly neutral, NO stock/fake human photos)
const DEFAULT_FALLBACK_PROFILES: RelatedInstagramProfile[] = [
  { username: 'perfil_1', profilePicture: undefined },
  { username: 'conta_2', profilePicture: undefined },
  { username: 'user_3', profilePicture: undefined },
  { username: 'perfil_4', profilePicture: undefined },
  { username: 'conta_5', profilePicture: undefined },
  { username: 'user_6', profilePicture: undefined },
  { username: 'perfil_7', profilePicture: undefined },
];

interface RealStoryCircleProps {
  username: string;
  profilePicture?: string | null;
  // Visual preview only — not real Instagram Close Friends data.
  previewType: 'close-friends' | 'normal';
  onClick: () => void;
}

const RealStoryCircle: React.FC<RealStoryCircleProps> = ({
  username,
  profilePicture,
  previewType,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(profilePicture || null);
  const [proxyTried, setProxyTried] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgSrc(profilePicture || null);
    setProxyTried(false);
    setImgError(false);
  }, [profilePicture]);

  const handleImgError = () => {
    if (!proxyTried && imgSrc && !imgSrc.startsWith('/api/instagram/')) {
      setProxyTried(true);
      setImgSrc(getProxiedInstagramImage(imgSrc));
    } else {
      setImgError(true);
    }
  };

  const isCloseFriends = previewType === 'close-friends';
  const maskedName = maskUsername(username);

  const finalSrc = imgSrc 
    ? (imgSrc.startsWith('/api/instagram/') || !imgSrc.startsWith('http') 
        ? imgSrc 
        : getProxiedInstagramImage(imgSrc) || imgSrc) 
    : null;

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
          {!imgError && finalSrc ? (
            <img
              src={finalSrc}
              alt={`Story de @${username}`}
              onError={handleImgError}
              className="w-full h-full object-cover rounded-full bg-neutral-900"
            />
          ) : (
            /* Avatar placeholder on failure — NEVER a lock! */
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <User className="w-6 h-6 text-neutral-400" />
            </div>
          )}
        </div>
      </div>
      <span className="text-[11px] text-[#F5F5F5] font-mono truncate max-w-[72px] text-center tracking-tight leading-tight">
        {maskedName}
      </span>
    </div>
  );
};

export interface SocialStoriesRowProps {
  mainProfilePic?: string | null;
  mainUsername: string;
  relatedProfiles?: RelatedInstagramProfile[] | null;
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

  const cleanMainUser = (mainUsername || '').trim().replace(/^@/, '').toLowerCase();
  const sessionKey = `previewStoriesViewed:${cleanMainUser}`;

  // Reset por nova pesquisa: reads specifically for this username
  const [freeStoriesViewed, setFreeStoriesViewed] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem(sessionKey);
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Whenever username changes, re-sync with session key for this specific username
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(sessionKey);
      setFreeStoriesViewed(stored ? parseInt(stored, 10) || 0 : 0);
    } catch {
      setFreeStoriesViewed(0);
    }
  }, [sessionKey]);

  useEffect(() => {
    setMainPicSrc(mainProfilePic || null);
    setMainImgErr(false);
    setMainProxyTried(false);
  }, [mainProfilePic]);

  const handleMainImgError = () => {
    if (!mainProxyTried && mainPicSrc && !mainPicSrc.startsWith('/api/instagram/')) {
      setMainProxyTried(true);
      setMainPicSrc(getProxiedInstagramImage(mainPicSrc));
    } else {
      setMainImgErr(true);
    }
  };

  const previewStoriesConsumed = freeStoriesViewed >= FREE_STORY_LIMIT;

  const handleStoryItemClick = (storyIndex: number) => {
    if (!previewStoriesConsumed) {
      const next = freeStoriesViewed + 1;
      setFreeStoriesViewed(next);
      try {
        sessionStorage.setItem(sessionKey, String(next));
      } catch {}
    }
    onStoryClick();
  };

  // Section 3: Seleção e deduplicação dos perfis relacionados
  const displayedProfiles = React.useMemo(() => {
    const seen = new Set<string>();
    const result: RelatedInstagramProfile[] = [];

    // 1. Add real profiles from API if available
    if (relatedProfiles && Array.isArray(relatedProfiles)) {
      for (const p of relatedProfiles) {
        if (!p || typeof p.username !== 'string') continue;
        const cleanUser = p.username.trim().replace(/^@/, '').toLowerCase();
        if (!cleanUser || cleanUser === cleanMainUser || seen.has(cleanUser)) continue;
        seen.add(cleanUser);
        result.push(p);
        if (result.length >= 7) break;
      }
    }

    // 2. If fewer than 7, complete with existing placeholders (never invent profiles)
    if (result.length < 7) {
      for (const fb of DEFAULT_FALLBACK_PROFILES) {
        if (result.length >= 7) break;
        const cleanFb = fb.username.toLowerCase();
        if (!seen.has(cleanFb) && cleanFb !== cleanMainUser) {
          seen.add(cleanFb);
          result.push(fb);
        }
      }
    }

    return result.slice(0, 7);
  }, [relatedProfiles, cleanMainUser]);

  // Distribution:
  // 7 ou mais: 4 verdes, 3 normais
  // 6: 4 verdes, 2 normais
  // 5: 3 verdes, 2 normais
  // 4: 3 verdes, 1 normal
  // 3: 2 verdes, 1 normal
  const totalProfiles = displayedProfiles.length;
  const closeFriendsCount = totalProfiles >= 6 ? 4 : totalProfiles === 5 ? 3 : totalProfiles === 4 ? 3 : Math.min(totalProfiles, 2);

  const mainSrc = mainPicSrc 
    ? (mainPicSrc.startsWith('/api/instagram/') || !mainPicSrc.startsWith('http') 
        ? mainPicSrc 
        : getProxiedInstagramImage(mainPicSrc) || mainPicSrc)
    : null;

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-[14px] px-[14px] border-b border-[#24282E]/30 bg-[#080B0E] select-none">
      <div className="flex items-center gap-[14px] min-w-max">
        
        {/* 1. Main Profile Story Circle ("Seu story") */}
        <div
          onClick={() => handleStoryItemClick(0)}
          className="flex flex-col items-center gap-1.5 cursor-pointer group"
        >
          <div className="relative w-[70px] h-[70px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA] shadow-[0_0_12px_rgba(236,72,153,0.22)] transition-transform duration-200 group-hover:scale-105 active:scale-95">
            <div className="w-full h-full rounded-full bg-[#080B0E] p-[2px] overflow-hidden flex items-center justify-center">
              {!mainImgErr && mainSrc ? (
                <img
                  src={mainSrc}
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

          <span className="text-[11px] text-[#F5F5F5] font-normal truncate max-w-[72px] text-center tracking-tight leading-tight">
            Seu story
          </span>
        </div>

        {/* 2. Related Profile Stories */}
        {displayedProfiles.map((profile, idx) => {
          // Visual preview only — not real Instagram Close Friends data.
          const previewType: 'close-friends' | 'normal' = idx < closeFriendsCount ? 'close-friends' : 'normal';

          // Locked ONLY after FREE_STORY_LIMIT has been consumed by the user!
          const isStoryLocked = previewStoriesConsumed && idx >= FREE_STORY_LIMIT;

          if (isStoryLocked) {
            return (
              <div
                key={`locked-story-${profile.username}-${idx}`}
                onClick={() => handleStoryItemClick(idx + 1)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className="relative w-[70px] h-[70px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA] transition-transform duration-200 group-hover:scale-105 active:scale-95">
                  <div className="w-full h-full rounded-full bg-[#12161C] p-[2px] overflow-hidden flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="text-[11px] text-[#A8A8A8] font-mono truncate max-w-[72px] text-center tracking-tight leading-tight">
                  {maskUsername(profile.username)}
                </span>
              </div>
            );
          }

          return (
            <RealStoryCircle
              key={`story-${profile.username}-${idx}`}
              username={profile.username}
              profilePicture={profile.profilePicture}
              previewType={previewType}
              onClick={() => handleStoryItemClick(idx + 1)}
            />
          );
        })}

      </div>
    </div>
  );
};

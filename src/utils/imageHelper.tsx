import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import type { InstagramProfileData } from '../services/instagramProfile';

/**
 * Returns proxy URL for arbitrary external Instagram CDN images
 */
export function getProxiedImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('/api/instagram/')) return url;
  if (!url.startsWith('http')) return url;
  return `/api/instagram/proxy-image?url=${encodeURIComponent(url)}`;
}

/**
 * Returns preferred image URL for a profile (direct or proxy endpoint)
 */
export function getProfileImage(profile: InstagramProfileData | null | undefined): string | null {
  if (!profile) return null;
  if (profile.profilePicture) {
    return profile.profilePicture;
  }
  if (profile.username) {
    return `/api/instagram/profile-image?username=${encodeURIComponent(profile.username)}`;
  }
  return null;
}

interface RobustAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  iconSize?: number;
  usernameContext?: string;
}

export const RobustAvatar: React.FC<RobustAvatarProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover rounded-full',
  iconSize = 16,
  usernameContext,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(src || null);
  const [stage, setStage] = useState<'direct' | 'proxy' | 'failed'>('direct');

  useEffect(() => {
    setCurrentSrc(src || null);
    setStage('direct');
  }, [src]);

  const handleError = () => {
    if (stage === 'direct' && currentSrc && !currentSrc.startsWith('/api/instagram/')) {
      const proxied = getProxiedImageUrl(currentSrc);
      console.log(`[RelatedImage] Fallback to proxy for @${usernameContext || alt}:`, {
        original: currentSrc,
        proxied,
      });
      setStage('proxy');
      setCurrentSrc(proxied);
    } else {
      console.warn(`[RelatedImage] Image failed completely for @${usernameContext || alt}`);
      setStage('failed');
      setCurrentSrc(null);
    }
  };

  if (stage === 'failed' || !currentSrc) {
    return (
      <div className="w-full h-full bg-[#101318] flex items-center justify-center text-neutral-500 rounded-full">
        <User style={{ width: iconSize, height: iconSize }} />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
};

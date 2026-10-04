import React from 'react';
import type { InstagramProfileData } from '../../services/instagramProfile';
import { RestrictedPreviewPost } from './RestrictedPreviewPost';
import { maskUsername } from './SocialStoriesRow';

export interface RestrictedPreviewFeedProps {
  profile?: InstagramProfileData;
  onBlockedClick: () => void;
}

export const RestrictedPreviewFeed: React.FC<RestrictedPreviewFeedProps> = ({
  profile,
  onBlockedClick,
}) => {
  // Default configs for varied blocked preview posts (masked identities, protected synthetic avatars, blurred real images)
  const feedConfigs = [
    {
      maskedUsername: 'adr******',
      previewAge: 'há 23 horas',
      previewImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      likedPreview: true,
      savedPreview: false,
      previewCounts: { likes: 74, comments: 4, shares: 3 },
    },
    {
      maskedUsername: 'luc******',
      previewAge: 'há 8 horas',
      previewImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
      likedPreview: false,
      savedPreview: true,
      previewCounts: { likes: 128, comments: 12, shares: 5 },
    },
    {
      maskedUsername: 'bia******',
      previewAge: 'há 2 dias',
      previewImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      likedPreview: true,
      savedPreview: true,
      previewCounts: { likes: 42, comments: 2, shares: 1 },
    },
  ];

  const relatedProfiles = (profile?.relatedProfiles || []).filter(
    (p) => p && typeof p.username === 'string' && p.username.trim().length > 0
  );

  const publicMediaList: Array<{ imageUrl?: string; sourceUsername?: string }> =
    Array.isArray((profile as any)?.publicPreviewMedia)
      ? (profile as any).publicPreviewMedia
      : [];

  return (
    <div className="w-full bg-[#080B0E] select-none">
      {feedConfigs.map((cfg, idx) => {
        const isLast = idx === feedConfigs.length - 1;

        // Visual preview separation:
        // authorVisual: real related profile from Apify + YepAPI
        const previewAuthor = relatedProfiles.length > 0
          ? relatedProfiles[idx % relatedProfiles.length]
          : null;

        const authorVisual = {
          avatarUrl: previewAuthor?.profilePicture || null,
          maskedUsername: previewAuthor ? maskUsername(previewAuthor.username) : cfg.maskedUsername,
        };

        // Media priority:
        // 1. Real public media from public related profile if available
        // 2. Demo fixture
        const publicMedia = publicMediaList[idx]?.imageUrl || cfg.previewImageUrl;

        return (
          <RestrictedPreviewPost
            key={`restricted-feed-item-${idx}`}
            maskedUsername={authorVisual.maskedUsername}
            authorAvatar={authorVisual.avatarUrl}
            previewAge={cfg.previewAge}
            previewImageUrl={publicMedia}
            likedPreview={cfg.likedPreview}
            savedPreview={cfg.savedPreview}
            previewCounts={cfg.previewCounts}
            onBlockedClick={onBlockedClick}
            isLast={isLast}
          />
        );
      })}
    </div>
  );
};

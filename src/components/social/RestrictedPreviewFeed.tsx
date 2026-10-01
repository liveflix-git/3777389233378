import React from 'react';
import { RestrictedPreviewPost } from './RestrictedPreviewPost';

export interface RestrictedPreviewFeedProps {
  onBlockedClick: () => void;
}

export const RestrictedPreviewFeed: React.FC<RestrictedPreviewFeedProps> = ({
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

  return (
    <div className="w-full bg-[#080B0E] select-none">
      {feedConfigs.map((cfg, idx) => {
        const isLast = idx === feedConfigs.length - 1;

        return (
          <RestrictedPreviewPost
            key={`restricted-feed-item-${idx}`}
            maskedUsername={cfg.maskedUsername}
            previewAge={cfg.previewAge}
            previewImageUrl={cfg.previewImageUrl}
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

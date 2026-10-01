import React, { useState, useEffect } from 'react';
import { RestrictedPreviewPost } from './RestrictedPreviewPost';
import {
  fetchApproximateVisitorLocation,
  getRegionalPreviewLocations,
  type ApproximateVisitorLocation,
} from '../../services/visitorLocation';

export interface RestrictedPreviewFeedProps {
  onBlockedClick: () => void;
  visitorLocation?: ApproximateVisitorLocation | null;
}

export const RestrictedPreviewFeed: React.FC<RestrictedPreviewFeedProps> = ({
  onBlockedClick,
  visitorLocation: propLocation,
}) => {
  const [visitorLocation, setVisitorLocation] = useState<ApproximateVisitorLocation | null>(
    propLocation || null
  );

  useEffect(() => {
    if (!propLocation) {
      fetchApproximateVisitorLocation().then((loc) => {
        setVisitorLocation(loc);
      });
    }
  }, [propLocation]);

  // Regional preview locations generated strictly for UI preview of blocked posts
  const regionalLocations = getRegionalPreviewLocations(visitorLocation);

  // Default configs for varied blocked preview posts (masked identities, protected synthetic avatars, blurred real images)
  const feedConfigs = [
    {
      maskedUsername: 'adr******',
      maskedDisplayName: 'Adriana S.',
      previewAge: 'há 23 horas',
      previewImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      likedPreview: true,
      savedPreview: false,
      previewCounts: { likes: 74, comments: 4, shares: 3 },
    },
    {
      maskedUsername: 'luc******',
      maskedDisplayName: 'Lucas R.',
      previewAge: 'há 8 horas',
      previewImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
      likedPreview: false,
      savedPreview: true,
      previewCounts: { likes: 128, comments: 12, shares: 5 },
    },
    {
      maskedUsername: 'bia******',
      maskedDisplayName: 'Beatriz M.',
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
        const previewLoc =
          regionalLocations.length > 0
            ? regionalLocations[idx % regionalLocations.length]
            : null;

        return (
          <RestrictedPreviewPost
            key={`restricted-feed-item-${idx}`}
            maskedUsername={cfg.maskedUsername}
            maskedDisplayName={cfg.maskedDisplayName}
            previewLocation={previewLoc}
            locationOrigin={previewLoc ? 'regional-ui-preview' : 'none'}
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

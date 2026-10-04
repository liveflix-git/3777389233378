import React from 'react';
import type { InstagramProfileData } from '../../services/instagramProfile';
import { RestrictedPreviewFeed } from './RestrictedPreviewFeed';

export interface SocialFeedAreaProps {
  profile?: InstagramProfileData;
  onBlockedClick: () => void;
}

export const SocialFeedArea: React.FC<SocialFeedAreaProps> = ({ profile, onBlockedClick }) => {
  return <RestrictedPreviewFeed profile={profile} onBlockedClick={onBlockedClick} />;
};

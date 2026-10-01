import React from 'react';
import type { InstagramProfileData } from '../../services/instagramProfile';
import { TopSocialBar } from './TopSocialBar';
import { StoryRow } from './StoryRow';
import { ProfileHeaderCompact } from './ProfileHeaderCompact';
import { RestrictedFeedArea } from './RestrictedFeedArea';
import { BottomPreviewBar } from './BottomPreviewBar';

interface SocialProfileViewProps {
  profile: InstagramProfileData;
  onVipAction: () => void;
  onBack: () => void;
}

export const SocialProfileView: React.FC<SocialProfileViewProps> = ({
  profile,
  onVipAction,
  onBack,
}) => {
  return (
    <div className="w-full min-h-screen max-w-[430px] mx-auto bg-[#000000] text-white flex flex-col relative animate-fadeIn shadow-[0_0_50px_rgba(0,0,0,0.9)]">
      {/* 1. Top Bar */}
      <TopSocialBar onBack={onBack} username={profile.username} />

      {/* 2. Story Row (Circles) */}
      <StoryRow
        mainProfilePic={profile.profilePicture}
        mainUsername={profile.username}
        onStoryClick={onVipAction}
      />

      {/* 3. Profile Header (Photo, stats, name, bio, private indicator) */}
      <ProfileHeaderCompact profile={profile} />

      {/* 4. Restricted Feed Area with tabs and lock */}
      <RestrictedFeedArea
        profile={profile}
        onUnlock={onVipAction}
      />

      {/* 5. Sticky Bottom VIP bar */}
      <BottomPreviewBar onVipClick={onVipAction} />
    </div>
  );
};

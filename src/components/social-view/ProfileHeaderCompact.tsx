import React, { useState } from 'react';
import { BadgeCheck, LockKeyhole, Eye } from 'lucide-react';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface ProfileHeaderCompactProps {
  profile: InstagramProfileData;
}

export const ProfileHeaderCompact: React.FC<ProfileHeaderCompactProps> = ({ profile }) => {
  const [avatarError, setAvatarError] = useState(false);

  const formatCount = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '-';
    if (num >= 1000000) {
      const val = (num / 1000000).toFixed(1).replace(/\.0$/, '').replace('.', ',');
      return `${val} mi`;
    }
    if (num >= 10000) {
      const val = (num / 1000).toFixed(1).replace(/\.0$/, '').replace('.', ',');
      return `${val} mil`;
    }
    return num.toLocaleString('pt-BR');
  };

  return (
    <div className="px-4 py-3.5 bg-[#000000] border-b border-neutral-900 select-none space-y-3">
      {/* Top Row: Large Photo (78-86px) + Stats Counts */}
      <div className="flex items-center gap-5 sm:gap-6">
        
        {/* Real Profile Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-[84px] sm:h-[84px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_0_15px_rgba(221,42,123,0.25)]">
            <div className="w-full h-full rounded-full bg-black p-[2px] overflow-hidden flex items-center justify-center">
              {!avatarError && profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`Perfil de ${profile.username}`}
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover rounded-full bg-neutral-900"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                  <Eye className="w-7 h-7 text-[#60A5FA]" />
                </div>
              )}
            </div>
          </div>
          {profile.isPrivate && (
            <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#60A5FA] shadow-md">
              <LockKeyhole className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Real stats: Posts | Seguidores | Seguindo */}
        <div className="flex-1 grid grid-cols-3 text-center gap-1">
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-base sm:text-lg text-white leading-tight">
              {formatCount(profile.posts)}
            </span>
            <span className="text-xs text-neutral-400 font-normal mt-0.5">
              posts
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-base sm:text-lg text-white leading-tight">
              {formatCount(profile.followers)}
            </span>
            <span className="text-xs text-neutral-400 font-normal mt-0.5">
              seguidores
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-base sm:text-lg text-white leading-tight">
              {formatCount(profile.following)}
            </span>
            <span className="text-xs text-neutral-400 font-normal mt-0.5">
              seguindo
            </span>
          </div>
        </div>

      </div>

      {/* Name, @, verified and bio */}
      <div className="space-y-1 text-left pt-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h2 className="font-semibold text-[15px] sm:text-base text-white tracking-tight">
            {profile.fullName || profile.username}
          </h2>
          {profile.isVerified && (
            <BadgeCheck className="w-4 h-4 text-[#0095F6] fill-[#0095F6]/20 shrink-0" />
          )}
        </div>

        <p className="text-xs sm:text-[13px] text-neutral-400 font-normal">
          @{profile.username}
        </p>

        {profile.biography && (
          <p className="text-xs sm:text-[13.5px] text-neutral-200 pt-1 leading-snug whitespace-pre-line break-words font-normal">
            {profile.biography}
          </p>
        )}

        {profile.isPrivate && (
          <div className="pt-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs bg-neutral-900 text-neutral-300 border border-neutral-800 font-normal">
              <LockKeyhole className="w-3 h-3 text-[#60A5FA]" />
              Conta privada
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

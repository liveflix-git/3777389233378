import React, { useState } from 'react';
import { BadgeCheck, LockKeyhole, Eye } from 'lucide-react';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface ProfileHeaderProps {
  profile: InstagramProfileData;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="space-y-3 font-instagram">
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Avatar com anel de gradiente Instagram/Espia Aí */}
        <div className="relative shrink-0">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_0_20px_rgba(221,42,123,0.3)]">
            <div className="w-full h-full rounded-full p-[2px] bg-black">
              {!avatarError && profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`Foto oficial de ${profile.username}`}
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover rounded-full bg-neutral-900"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-neutral-900 flex flex-col items-center justify-center text-white">
                  <Eye className="w-6 h-6 text-[#60A5FA]" />
                  <span className="text-[7px] font-mono-tech text-neutral-400 uppercase mt-0.5">
                    Espia Aí
                  </span>
                </div>
              )}
            </div>
          </div>
          {profile.isPrivate && (
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#60A5FA] shadow-md">
              <LockKeyhole className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Nome, @ e badges */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="font-semibold text-base sm:text-lg text-white tracking-tight truncate max-w-full">
              {profile.fullName || profile.username}
            </h2>
            {profile.isVerified && (
              <BadgeCheck className="w-4 h-4 text-[#0095F6] fill-[#0095F6]/20 shrink-0" />
            )}
            {profile.isPrivate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-800/90 text-neutral-300 border border-neutral-700">
                <LockKeyhole className="w-2.5 h-2.5 text-[#60A5FA]" />
                Privada
              </span>
            )}
          </div>

          <p className="text-xs sm:text-[13px] text-[#A8A8A8] font-normal tracking-tight">
            @{profile.username}
          </p>
        </div>
      </div>

      {/* Biografia Real (nunca preenche com dados falsos se vazia) */}
      {profile.biography ? (
        <div className="pt-1 text-left">
          <p className="text-xs sm:text-[13.5px] text-[#F5F5F5] font-normal leading-[1.4] whitespace-pre-line break-words tracking-tight">
            {profile.biography}
          </p>
        </div>
      ) : profile.isPrivate ? (
        <div className="pt-1 text-left">
          <p className="text-xs text-neutral-400 italic">
            Esta conta é privada.
          </p>
        </div>
      ) : null}
    </div>
  );
};

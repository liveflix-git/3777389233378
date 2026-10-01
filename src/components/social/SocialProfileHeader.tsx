import React, { useState } from 'react';
import { BadgeCheck, LockKeyhole, Eye } from 'lucide-react';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface SocialProfileHeaderProps {
  profile: InstagramProfileData;
  onStoryClick?: () => void;
}

export const SocialProfileHeader: React.FC<SocialProfileHeaderProps> = ({ profile, onStoryClick }) => {
  const [avatarError, setAvatarError] = useState(false);
  const [showEditNotice, setShowEditNotice] = useState(false);

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

  const handleEditClick = () => {
    setShowEditNotice(true);
    setTimeout(() => {
      setShowEditNotice(false);
    }, 2500);
  };

  return (
    <div className="px-4 py-4 bg-[#080A0D] border-b border-[#262A30] select-none space-y-3.5">
      {/* Top Row: Photo (78-86px) + Real Stats Counts */}
      <div className="flex items-center gap-5 sm:gap-7">
        
        {/* Real Profile Avatar */}
        <div 
          onClick={onStoryClick}
          className="relative shrink-0 cursor-pointer group"
        >
          <div className="w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA] shadow-[0_0_15px_rgba(236,72,153,0.25)] transition-transform duration-200 group-hover:scale-105">
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
                  <Eye className="w-7 h-7 text-[#3B82F6]" />
                </div>
              )}
            </div>
          </div>
          {profile.isPrivate && (
            <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#3B82F6] shadow-md">
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
            <span className="text-xs text-[#A8A8A8] font-normal mt-0.5">
              posts
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-base sm:text-lg text-white leading-tight">
              {formatCount(profile.followers)}
            </span>
            <span className="text-xs text-[#A8A8A8] font-normal mt-0.5">
              seguidores
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-base sm:text-lg text-white leading-tight">
              {formatCount(profile.following)}
            </span>
            <span className="text-xs text-[#A8A8A8] font-normal mt-0.5">
              seguindo
            </span>
          </div>
        </div>

      </div>

      {/* Name, @, verified, bio and private status */}
      <div className="space-y-1 text-left pt-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h1 className="font-semibold text-base sm:text-[17px] text-white tracking-tight">
            {profile.fullName || profile.username}
          </h1>
          {profile.isVerified && (
            <BadgeCheck className="w-4 h-4 text-[#0095F6] fill-[#0095F6]/20 shrink-0" />
          )}
        </div>

        <p className="text-xs sm:text-[13px] text-[#A8A8A8] font-normal">
          @{profile.username}
        </p>

        {profile.biography && (
          <p className="text-xs sm:text-[13.5px] text-[#F5F5F5] pt-1 leading-snug whitespace-pre-line break-words font-normal">
            {profile.biography}
          </p>
        )}

        {profile.isPrivate && (
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs bg-[#101318] text-neutral-300 border border-[#262A30] font-normal">
              <LockKeyhole className="w-3 h-3 text-[#3B82F6]" />
              Conta privada
            </span>
          </div>
        )}

        {/* Action Button: Editar perfil */}
        <div className="pt-2.5">
          <button
            type="button"
            onClick={handleEditClick}
            className="w-full sm:w-auto px-4 py-1.5 h-[34px] rounded-lg bg-[#1C1F23] hover:bg-[#262A30] active:scale-98 text-white text-[13px] sm:text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer"
          >
            Editar perfil
          </button>
          {showEditNotice && (
            <p className="text-[11px] text-neutral-400 pt-1 animate-fadeIn">
              Disponível apenas para o proprietário do perfil
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

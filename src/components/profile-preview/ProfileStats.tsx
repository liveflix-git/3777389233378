import React from 'react';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface ProfileStatsProps {
  profile: InstagramProfileData;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
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
    <div className="grid grid-cols-3 text-center py-3 px-2 rounded-xl bg-neutral-950/80 border border-neutral-800/80 font-instagram">
      <div className="flex flex-col items-center justify-center">
        <span className="font-semibold text-sm sm:text-base text-[#F5F5F5] tracking-tight leading-tight">
          {formatCount(profile.posts)}
        </span>
        <span className="text-[11px] sm:text-xs text-[#A8A8A8] font-normal mt-0.5 tracking-tight">
          publicações
        </span>
      </div>

      <div className="flex flex-col items-center justify-center border-x border-neutral-800/60">
        <span className="font-semibold text-sm sm:text-base text-[#F5F5F5] tracking-tight leading-tight">
          {formatCount(profile.followers)}
        </span>
        <span className="text-[11px] sm:text-xs text-[#A8A8A8] font-normal mt-0.5 tracking-tight">
          seguidores
        </span>
      </div>

      <div className="flex flex-col items-center justify-center">
        <span className="font-semibold text-sm sm:text-base text-[#F5F5F5] tracking-tight leading-tight">
          {formatCount(profile.following)}
        </span>
        <span className="text-[11px] sm:text-xs text-[#A8A8A8] font-normal mt-0.5 tracking-tight">
          seguindo
        </span>
      </div>
    </div>
  );
};

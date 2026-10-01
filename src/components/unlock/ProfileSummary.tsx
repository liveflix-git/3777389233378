import React from 'react';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface ProfileSummaryProps {
  profile: InstagramProfileData;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile }) => {
  const username = profile?.username ?? 'usuario';
  const fullName = profile?.fullName || username;
  const profilePic =
    profile?.profilePicture ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="w-full flex flex-col items-center text-center space-y-5 select-none">
      {/* Main Headline */}
      <div className="px-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          A maior ferramenta de <span className="text-[#9333EA]">Stalker</span> do Brasil
        </h1>
      </div>

      {/* Profile Card */}
      <div className="w-full bg-[#101418] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col items-start text-left">
        <div className="flex items-center gap-4 w-full">
          {/* Avatar with Pink/Purple Gradient Ring */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#E1306C] via-[#C13584] to-[#833AB4] shadow-md">
              <img
                src={profilePic}
                alt={username}
                className="w-full h-full object-cover rounded-full bg-slate-900"
              />
            </div>
          </div>

          {/* Name & Stats */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white tracking-tight truncate">
              {fullName}
            </h2>
            <p className="text-xs text-[#9CA3AF] font-medium truncate">
              @{username}
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-between mt-3 text-center text-white">
              <div>
                <span className="text-sm font-bold block leading-tight">
                  {typeof profile.posts === 'number'
                    ? profile.posts.toLocaleString('pt-BR')
                    : '0'}
                </span>
                <span className="text-[11px] text-[#A0A6B2] font-normal">posts</span>
              </div>

              <div>
                <span className="text-sm font-bold block leading-tight">
                  {typeof profile.followers === 'number'
                    ? profile.followers.toLocaleString('pt-BR')
                    : '1.401'}
                </span>
                <span className="text-[11px] text-[#A0A6B2] font-normal">seguidores</span>
              </div>

              <div>
                <span className="text-sm font-bold block leading-tight">
                  {typeof profile.following === 'number'
                    ? profile.following.toLocaleString('pt-BR')
                    : '1.002'}
                </span>
                <span className="text-[11px] text-[#A0A6B2] font-normal">seguindo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio text if available */}
        {profile.biography && (
          <div className="mt-4 pt-3 border-t border-white/5 w-full text-xs text-white/90 whitespace-pre-line leading-relaxed">
            {profile.biography}
          </div>
        )}
      </div>
    </div>
  );
};

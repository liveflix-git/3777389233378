import React, { useState } from 'react';
import { Grid, Film, Tag, Lock, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Eye } from 'lucide-react';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface RestrictedFeedAreaProps {
  profile: InstagramProfileData;
  onUnlock?: () => void;
}

export const RestrictedFeedArea: React.FC<RestrictedFeedAreaProps> = ({ profile, onUnlock }) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tagged'>('grid');
  const [avatarErr, setAvatarErr] = useState(false);

  const hasPublicPosts = !profile.isPrivate && Array.isArray(profile.latestPosts) && profile.latestPosts.length > 0;

  return (
    <div className="w-full bg-[#000000] pb-36 select-none">
      
      {/* 1. Feed Navigation Tabs: GRID | REELS | TAGGED */}
      <div className="grid grid-cols-3 border-t border-b border-neutral-900 bg-[#000000]">
        <button
          type="button"
          onClick={() => setActiveTab('grid')}
          className={`py-3 flex items-center justify-center transition-colors cursor-pointer relative ${
            activeTab === 'grid' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
          aria-label="Grade de publicações"
        >
          <Grid className="w-5 h-5" />
          {activeTab === 'grid' && (
            <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-white" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`py-3 flex items-center justify-center transition-colors cursor-pointer relative ${
            activeTab === 'reels' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
          aria-label="Reels"
        >
          <Film className="w-5 h-5" />
          {activeTab === 'reels' && (
            <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-white" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tagged')}
          className={`py-3 flex items-center justify-center transition-colors cursor-pointer relative ${
            activeTab === 'tagged' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
          aria-label="Marcados"
        >
          <Tag className="w-5 h-5" />
          {activeTab === 'tagged' && (
            <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-white" />
          )}
        </button>
      </div>

      {/* 2. Feed Body: Public Posts Grid OR Full Restricted Canvas */}
      {hasPublicPosts && activeTab === 'grid' ? (
        <div className="space-y-4 pt-1">
          {/* Public posts grid */}
          <div className="grid grid-cols-3 gap-0.5">
            {profile.latestPosts!.map((post, idx) => (
              <div
                key={post.id || `post-${idx}`}
                onClick={onUnlock}
                className="relative aspect-square bg-neutral-900 overflow-hidden cursor-pointer group"
              >
                {post.displayUrl ? (
                  <img
                    src={post.displayUrl}
                    alt={post.caption || 'Publicação'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-neutral-600">
                    <Grid className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Followed by simulated locked post */}
          <div className="border-t border-neutral-900">
            <RestrictedPostCard profile={profile} onUnlock={onUnlock} avatarErr={avatarErr} setAvatarErr={setAvatarErr} />
          </div>
        </div>
      ) : (
        /* Full Restricted Social View for Private / Locked Profiles */
        <div className="pt-2">
          <RestrictedPostCard profile={profile} onUnlock={onUnlock} avatarErr={avatarErr} setAvatarErr={setAvatarErr} />
        </div>
      )}

    </div>
  );
};

interface RestrictedPostCardProps {
  profile: InstagramProfileData;
  onUnlock?: () => void;
  avatarErr: boolean;
  setAvatarErr: (v: boolean) => void;
}

const RestrictedPostCard: React.FC<RestrictedPostCardProps> = ({
  profile,
  onUnlock,
  avatarErr,
  setAvatarErr,
}) => {
  return (
    <div className="w-full bg-[#000000]">
      {/* Post Author Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shrink-0">
            <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
              {!avatarErr && profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.username}
                  onError={() => setAvatarErr(true)}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Eye className="w-4 h-4 text-[#60A5FA]" />
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-xs sm:text-[13px] text-white">
              {profile.username}
            </span>
            <span className="text-[11px] text-neutral-400">
              Publicação recente
            </span>
          </div>
        </div>

        <button type="button" className="text-neutral-400 hover:text-white p-1" aria-label="Opções">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Central Restricted Content Canvas (Like the reference image) */}
      <div
        onClick={onUnlock}
        className="relative w-full aspect-square bg-gradient-to-b from-[#0A0D14] via-[#050507] to-[#000000] border-y border-neutral-900 flex flex-col items-center justify-center p-6 text-center cursor-pointer group select-none overflow-hidden"
      >
        {/* Subtle blurred abstract background (no identifiable faces) */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-purple-950/25 to-slate-950/30 scale-125"
          style={{ filter: 'blur(16px)' }}
        />

        {/* Central Lock and Restricted Notice */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-neutral-900/90 border border-neutral-700/80 shadow-[0_0_30px_rgba(0,0,0,0.85)] flex items-center justify-center text-white group-hover:scale-105 active:scale-95 transition-transform duration-200">
            <Lock className="w-7 h-7 text-white" />
          </div>

          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Conteúdo restrito
            </h4>
            <p className="text-xs text-neutral-400 font-mono-tech">
              há 21 horas
            </p>
          </div>
        </div>
      </div>

      {/* Post Action Buttons */}
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button type="button" className="hover:text-[#EF4444] transition-colors active:scale-90" aria-label="Curtir">
              <Heart className="w-6 h-6 stroke-[1.8]" />
            </button>
            <button type="button" className="hover:text-neutral-300 transition-colors active:scale-90" aria-label="Comentar">
              <MessageCircle className="w-6 h-6 stroke-[1.8]" />
            </button>
            <button type="button" className="hover:text-[#3B82F6] transition-colors active:scale-90" aria-label="Compartilhar">
              <Send className="w-6 h-6 stroke-[1.8] -rotate-12" />
            </button>
          </div>

          <button type="button" className="hover:text-neutral-300 transition-colors active:scale-90" aria-label="Salvar">
            <Bookmark className="w-6 h-6 stroke-[1.8]" />
          </button>
        </div>

        {/* Masked Likes Preview */}
        <div className="text-xs sm:text-[13px] text-neutral-300 font-normal">
          Curtido por <span className="font-semibold text-white font-mono-tech">a******</span> e <span className="font-semibold text-white">outras pessoas</span>
        </div>

        {/* Caption */}
        <div className="text-xs sm:text-[13px] text-neutral-400 leading-snug">
          <span className="font-semibold text-white mr-1.5">{profile.username}</span>
          <span className="italic text-neutral-500">🔒 Conteúdo e comentários ocultos na prévia gratuita</span>
        </div>
      </div>
    </div>
  );
};

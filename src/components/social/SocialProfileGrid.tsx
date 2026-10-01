import React, { useState } from 'react';
import { Grid, Film, Tag, Lock } from 'lucide-react';
import type { InstagramProfileData, LatestPostItem } from '../../services/instagramProfile';

interface SocialProfileGridProps {
  profile: InstagramProfileData;
  onBlockedClick: () => void;
}

export const SocialProfileGrid: React.FC<SocialProfileGridProps> = ({ profile, onBlockedClick }) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tagged'>('grid');

  const hasPublicPosts = !profile.isPrivate && Array.isArray(profile.latestPosts) && profile.latestPosts.length > 0;

  return (
    <div className="w-full bg-[#080B0E] select-none">
      
      {/* Profile Navigation Tabs: GRID | REELS | TAGGED */}
      <div className="grid grid-cols-3 border-t border-b border-[#24282E] bg-[#080B0E]">
        <button
          type="button"
          onClick={() => setActiveTab('grid')}
          className={`py-3 flex items-center justify-center transition-colors cursor-pointer relative ${
            activeTab === 'grid' ? 'text-white' : 'text-[#A8A8A8] hover:text-white'
          }`}
          aria-label="Grade de publicações"
        >
          <Grid className="w-5 h-5" />
          {activeTab === 'grid' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`py-3 flex items-center justify-center transition-colors cursor-pointer relative ${
            activeTab === 'reels' ? 'text-white' : 'text-[#A8A8A8] hover:text-white'
          }`}
          aria-label="Reels"
        >
          <Film className="w-5 h-5" />
          {activeTab === 'reels' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tagged')}
          className={`py-3 flex items-center justify-center transition-colors cursor-pointer relative ${
            activeTab === 'tagged' ? 'text-white' : 'text-[#A8A8A8] hover:text-white'
          }`}
          aria-label="Marcados"
        >
          <Tag className="w-5 h-5" />
          {activeTab === 'tagged' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white" />
          )}
        </button>
      </div>

      {/* Grid Content: Real 3-column square posts OR private restricted notice */}
      {hasPublicPosts && activeTab === 'grid' ? (
        <div className="grid grid-cols-3 gap-1 pt-1">
          {profile.latestPosts!.map((post: LatestPostItem, idx: number) => (
            <div
              key={post.id || `grid-post-${idx}`}
              onClick={onBlockedClick}
              className="relative aspect-square bg-[#101318] overflow-hidden cursor-pointer group"
            >
              {post.displayUrl ? (
                <img
                  src={post.displayUrl}
                  alt={post.caption || 'Publicação'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#101318] text-neutral-600">
                  <Grid className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div 
          onClick={onBlockedClick}
          className="py-16 px-6 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-[#101318] border border-[#24282E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">
              {profile.isPrivate ? 'Esta conta é privada' : 'Nenhuma publicação pública'}
            </h4>
            <p className="text-xs text-[#A8A8A8]">
              {profile.isPrivate
                ? 'Siga esta conta ou desbloqueie o acesso VIP para ver suas fotos e vídeos.'
                : 'As publicações deste perfil estão restritas no plano gratuito.'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

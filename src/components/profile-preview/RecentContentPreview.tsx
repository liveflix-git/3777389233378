import React, { useState } from 'react';
import { Grid, Lock, Image as ImageIcon, Film, Layers } from 'lucide-react';
import type { LatestPostItem } from '../../services/instagramProfile';

interface RecentContentPreviewProps {
  latestPosts?: LatestPostItem[] | null;
  isPrivate?: boolean | null;
}

export const RecentContentPreview: React.FC<RecentContentPreviewProps> = ({
  latestPosts,
  isPrivate,
}) => {
  const hasRealPosts = Array.isArray(latestPosts) && latestPosts.length > 0 && !isPrivate;

  return (
    <div className="space-y-2.5 pt-2 border-t border-neutral-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
          <Grid className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Publicações Recentes</span>
        </div>
        <span className="text-[10px] font-mono-tech text-neutral-400">
          {hasRealPosts ? `${latestPosts.length} itens públicos` : 'Prévia'}
        </span>
      </div>

      {hasRealPosts ? (
        <div className="grid grid-cols-3 gap-2">
          {latestPosts.slice(0, 3).map((post, idx) => (
            <PostThumbnailCard key={post.id || `post-${idx}`} post={post} />
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/70 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-[#60A5FA]">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs text-neutral-300 font-medium">
            {isPrivate
              ? 'Publicações não disponíveis publicamente (Conta Privada)'
              : 'Nenhuma publicação recente disponível'}
          </p>
          <p className="text-[10px] text-neutral-500">
            A análise completa compila histórico de frequência e interações públicas.
          </p>
        </div>
      )}
    </div>
  );
};

const PostThumbnailCard: React.FC<{ post: LatestPostItem }> = ({ post }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 group">
      {!imgErr && post.displayUrl ? (
        <img
          src={post.displayUrl}
          alt={post.caption || 'Publicação recente'}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 p-2">
          <ImageIcon className="w-6 h-6" />
        </div>
      )}

      {/* Post Type icon */}
      {post.type && (
        <div className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px]">
          {post.type.toLowerCase().includes('video') ? (
            <Film className="w-3 h-3" />
          ) : post.type.toLowerCase().includes('sidecar') || post.type.toLowerCase().includes('carousel') ? (
            <Layers className="w-3 h-3" />
          ) : (
            <ImageIcon className="w-3 h-3" />
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Lock, Heart, MessageCircle, Send, Bookmark, MoreVertical } from 'lucide-react';
import type { DataOrigin } from '../../services/instagramProfile';
import type { LocationOrigin } from '../../services/visitorLocation';

export interface RestrictedPreviewPostProps {
  maskedUsername: string;
  maskedDisplayName?: string;
  previewLocation?: string | null;
  locationOrigin?: LocationOrigin;
  previewAge: string;
  previewImageUrl?: string;
  likedPreview?: boolean;
  savedPreview?: boolean;
  previewCounts?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  onBlockedClick: () => void;
  isLast?: boolean;
}

export const RestrictedPreviewPost: React.FC<RestrictedPreviewPostProps> = ({
  maskedUsername,
  maskedDisplayName,
  previewLocation,
  locationOrigin = 'regional-ui-preview',
  previewAge,
  previewImageUrl = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
  likedPreview = false,
  savedPreview = false,
  previewCounts = { likes: 74, comments: 4, shares: 3 },
  onBlockedClick,
  isLast = false,
}) => {
  // Internal tracking tags - strictly isolated from target profile data
  const origin: DataOrigin = 'ui-preview';
  const interactionOrigin = 'ui-preview';

  const [isLiked, setIsLiked] = useState(likedPreview);
  const [isBookmarked, setIsBookmarked] = useState(savedPreview);

  const likesCount = previewCounts.likes
    ? previewCounts.likes + (isLiked && !likedPreview ? 1 : !isLiked && likedPreview ? -1 : 0)
    : null;

  const hasPreviewLocation = typeof previewLocation === 'string' && previewLocation.trim().length > 0;

  return (
    <article
      data-origin={origin}
      data-interaction-origin={interactionOrigin}
      data-location-origin={locationOrigin}
      className={`w-full bg-[#080B0E] ${!isLast ? 'border-b border-[#20242A]' : ''}`}
    >
      {/* 1. Header (Masked User + Blurred/Synthetic Avatar + Regional Preview Location) */}
      <div className="h-[54px] flex items-center justify-between px-[14px] py-2">
        <div className="flex items-center gap-3">
          {/* Protected/Blurred Synthetic Avatar */}
          <div className="w-[34px] h-[34px] rounded-full p-[1.5px] bg-gradient-to-tr from-neutral-700 via-neutral-800 to-neutral-900 shrink-0 shadow-sm overflow-hidden">
            <div className="w-full h-full rounded-full bg-neutral-900 overflow-hidden flex items-center justify-center relative">
              <div
                className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-neutral-900"
                style={{ filter: 'blur(8px) brightness(0.65)' }}
              />
              <Lock className="w-3.5 h-3.5 text-neutral-400 absolute" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[13.5px] font-semibold text-[#F5F5F5] leading-tight tracking-tight">
              {maskedUsername}
            </span>
            {hasPreviewLocation ? (
              <span className="text-[11px] text-[#A8A8A8] leading-tight pt-0.5 truncate max-w-[200px]">
                {previewLocation}
              </span>
            ) : (
              maskedDisplayName && (
                <span className="text-[11px] text-[#A8A8A8] leading-tight pt-0.5 truncate max-w-[180px]">
                  {maskedDisplayName}
                </span>
              )
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onBlockedClick}
          className="text-neutral-400 hover:text-white p-1 -mr-1 cursor-pointer transition-colors"
          aria-label="Opções"
        >
          <MoreVertical className="w-[19px] h-[19px]" />
        </button>
      </div>

      {/* 2. Large Restricted Content Media Area with Real Blurred Photo */}
      <div
        onClick={onBlockedClick}
        className="relative w-full min-h-[320px] sm:min-h-[380px] bg-[#0A0E12] border-y border-[#24282E]/40 flex flex-col items-center justify-center p-8 text-center cursor-pointer group select-none overflow-hidden"
      >
        {/* Extremely Blurred Real Background Image */}
        <img
          src={previewImageUrl}
          alt="Conteúdo restrito"
          className="absolute inset-0 w-full h-full object-cover filter blur-[24px] brightness-[0.38] scale-110 pointer-events-none transition-transform duration-500 group-hover:scale-115"
        />

        {/* Dark vignette gradient overlay over image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 pointer-events-none" />

        {/* Lock & Lock Details */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] flex items-center justify-center text-white group-hover:scale-105 active:scale-95 transition-transform duration-200">
            <Lock className="w-8 h-8 text-white/90" />
          </div>

          <div className="space-y-1">
            <h4 className="text-[16px] font-semibold text-white tracking-tight drop-shadow-md">
              Conteúdo restrito
            </h4>
            <span className="text-[12.5px] text-white/70 font-medium block drop-shadow">
              {previewAge}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Action Bar */}
      <div className="px-[14px] py-[12px] flex items-center text-white justify-between">
        <div className="flex items-center gap-[14px]">
          {/* Heart: 24px */}
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="transition-colors active:scale-90 cursor-pointer p-0.5 -ml-0.5"
            aria-label="Curtir"
          >
            <Heart
              className={`w-[24px] h-[24px] transition-transform ${
                isLiked
                  ? 'fill-[#FF3040] stroke-[#FF3040] text-[#FF3040] scale-105'
                  : 'text-white stroke-[1.8] hover:text-[#EC4899]'
              }`}
            />
          </button>

          {/* MessageCircle: 23px */}
          <button
            type="button"
            onClick={onBlockedClick}
            className="text-white hover:text-neutral-300 transition-colors active:scale-90 cursor-pointer p-0.5"
            aria-label="Comentar"
          >
            <MessageCircle className="w-[23px] h-[23px] stroke-[1.8]" />
          </button>

          {/* Send: 23px */}
          <button
            type="button"
            onClick={onBlockedClick}
            className="text-white hover:text-neutral-300 transition-colors active:scale-90 cursor-pointer p-0.5"
            aria-label="Compartilhar"
          >
            <Send className="w-[22px] h-[22px] stroke-[1.8]" />
          </button>
        </div>

        {/* Bookmark: 23px */}
        <button
          type="button"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="transition-colors active:scale-90 cursor-pointer p-0.5"
          aria-label="Salvar"
        >
          <Bookmark
            className={`w-[23px] h-[23px] transition-transform ${
              isBookmarked
                ? 'fill-white stroke-white text-white'
                : 'text-white stroke-[1.8] hover:text-neutral-300'
            }`}
          />
        </button>
      </div>

      {/* Likes count & caption preview line */}
      {likesCount !== null && (
        <div className="px-[14px] pb-3 text-xs text-[#F5F5F5] font-semibold leading-snug space-y-1">
          <div>{likesCount.toLocaleString('pt-BR')} curtidas</div>
          <div
            onClick={onBlockedClick}
            className="text-[#A8A8A8] font-normal cursor-pointer hover:underline truncate"
          >
            <span className="font-semibold text-white mr-1.5">{maskedUsername}</span>
            <span className="filter blur-[4px]">Legenda protegida da publicação...</span>
          </div>
        </div>
      )}
    </article>
  );
};

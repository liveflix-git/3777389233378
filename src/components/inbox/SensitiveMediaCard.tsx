import React from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface SensitiveMediaCardProps {
  onMediaClick: () => void;
  reactionEmoji?: string;
  imagePreset?: 'romantic' | 'portrait' | 'location';
}

export const SensitiveMediaCard: React.FC<SensitiveMediaCardProps> = ({
  onMediaClick,
  reactionEmoji = '❤️',
  imagePreset = 'romantic',
}) => {
  // Preset background gradients simulating real blurred photographic content
  const presetGradients = {
    romantic: 'from-[#EC4899] via-[#8B5CF6] to-[#1E1B4B]',
    portrait: 'from-[#3B82F6] via-[#6366F1] to-[#0F172A]',
    location: 'from-[#10B981] via-[#065F46] to-[#022C22]',
  };

  const bgGradient = presetGradients[imagePreset] || presetGradients.romantic;

  return (
    <div
      onClick={onMediaClick}
      className="relative w-[240px] max-w-[85%] h-[200px] rounded-[18px] rounded-tl-[4px] overflow-hidden border border-white/15 cursor-pointer group shadow-xl select-none my-1 transition-all active:scale-[0.98]"
    >
      {/* 1. Rich Simulated Photographic Background with heavy blur */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${bgGradient} scale-125`}>
        {/* Abstract light spots simulating subjects in a photo */}
        <div className="absolute top-1/4 left-1/3 w-28 h-28 rounded-full bg-pink-400/30 blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-indigo-300/25 blur-2xl" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 2. Glassmorphism Blur Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[12px] flex flex-col items-center justify-center p-4 text-center space-y-2 transition-colors group-hover:bg-black/35">
        
        {/* Lock Icon in Glass Badge */}
        <div className="w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform">
          <Lock className="w-5 h-5 text-white stroke-[2.2]" />
        </div>

        {/* Text Labels */}
        <div className="space-y-0.5">
          <p className="text-[13.5px] font-bold text-white tracking-tight leading-tight">
            Conteúdo bloqueado
          </p>
          <p className="text-[11.5px] text-white/90 font-medium leading-tight">
            Disponível apenas no VIP
          </p>
          <p className="text-[10.5px] font-semibold text-[#3797F0] tracking-wide pt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 fill-[#3797F0]" />
            <span>Toque para desbloquear</span>
          </p>
        </div>
      </div>

      {/* 3. Reaction Badge on Bottom Corner */}
      {reactionEmoji && (
        <div className="absolute bottom-2.5 right-2.5 bg-[#1C1C1E]/90 backdrop-blur-md border border-white/15 rounded-full px-2 py-0.5 text-[12px] flex items-center justify-center shadow-lg">
          <span>{reactionEmoji}</span>
        </div>
      )}
    </div>
  );
};

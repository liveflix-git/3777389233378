import React from 'react';
import { Lock, Image as ImageIcon } from 'lucide-react';

interface LockedMediaGridProps {
  username: string;
}

const MEDIA_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
];

export const LockedMediaGrid: React.FC<LockedMediaGridProps> = ({ username }) => {
  return (
    <div className="w-full bg-[#0D1213] border border-[#202829] rounded-[22px] p-5 shadow-lg select-none space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#8B5CF6]" />
          <span>Veja Mídias de @{username}</span>
        </h3>
        <p className="text-xs text-[#A8AEB5]">
          Visualize as áreas disponíveis na análise completa.
        </p>
      </div>

      {/* Grid: 1 Large Left, 2 Right, + Bottom row */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 h-48 sm:h-56">
          {/* Large Left Thumbnail */}
          <div className="col-span-2 relative rounded-xl overflow-hidden bg-slate-900 border border-[#202829]">
            <img
              src={MEDIA_PLACEHOLDERS[0]}
              alt="Mídia restrita"
              className="w-full h-full object-cover filter blur-[12px] brightness-[0.55]"
            />
            <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center gap-1.5 p-2 text-center">
              <div className="w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] font-medium text-white/90 uppercase tracking-wider">
                Conteúdo restrito
              </span>
            </div>
          </div>

          {/* 2 Stacked Right Thumbnails */}
          <div className="col-span-1 flex flex-col gap-2">
            {[1, 2].map((idx) => (
              <div key={idx} className="flex-1 relative rounded-xl overflow-hidden bg-slate-900 border border-[#202829]">
                <img
                  src={MEDIA_PLACEHOLDERS[idx]}
                  alt="Mídia restrita"
                  className="w-full h-full object-cover filter blur-[12px] brightness-[0.55]"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center p-1">
                  <div className="w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 3 Thumbnails */}
        <div className="grid grid-cols-3 gap-2 h-24 sm:h-28">
          {[3, 4, 5].map((idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden bg-slate-900 border border-[#202829]">
              <img
                src={MEDIA_PLACEHOLDERS[idx]}
                alt="Mídia restrita"
                className="w-full h-full object-cover filter blur-[12px] brightness-[0.55]"
              />
              <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center gap-1 p-1 text-center">
                <div className="w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
                <span className="text-[9px] font-medium text-white/80 uppercase tracking-tight">
                  Restrito
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Eye, Lock } from 'lucide-react';

interface LockedStoriesSectionProps {
  targetName?: string;
}

export const LockedStoriesSection: React.FC<LockedStoriesSectionProps> = ({ targetName = 'o usuário' }) => {
  return (
    <div className="w-full space-y-3.5 select-none my-6">
      {/* Title Header with Eye Icon */}
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#9333EA] shrink-0" />
          <span>Stories e posts ocultos</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#A0A6B2]">
          Veja stories de &quot;Melhores Amigos&quot; e posts que {targetName} ocultou de você.
        </p>
      </div>

      {/* Two Vertical Stories Cards Side By Side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Story Card 1 */}
        <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg">
          <img
            src="/images/cf_preview_1.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://i.ibb.co/H6v5xtx/cf1.png';
            }}
            alt="Story de melhores amigos"
            className="w-full h-full object-cover filter blur-[4px] brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2 p-3 text-center">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center shadow-md backdrop-blur-xs">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">
              Conteúdo restrito
            </span>
          </div>
        </div>

        {/* Story Card 2 */}
        <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg">
          <img
            src="/images/cf_preview_2.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://i.ibb.co/mrBrhN5q/cf2.png';
            }}
            alt="Story de melhores amigos"
            className="w-full h-full object-cover filter blur-[4px] brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2 p-3 text-center">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center shadow-md backdrop-blur-xs">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">
              Conteúdo restrito
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

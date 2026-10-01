import React from 'react';
import { Lock, Radio } from 'lucide-react';
import type { DataOrigin } from '../../services/instagramProfile';

interface StoryPreviewProps {
  onUnlock?: () => void;
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({ onUnlock }) => {
  // Demonstration placeholders strictly marked with origin: 'placeholder'
  const placeholders: Array<{ id: number; origin: DataOrigin; label: string }> = [
    { id: 1, origin: 'placeholder', label: 'Histórico 1' },
    { id: 2, origin: 'placeholder', label: 'Histórico 2' },
    { id: 3, origin: 'placeholder', label: 'Histórico 3' },
    { id: 4, origin: 'placeholder', label: 'Histórico 4' },
  ];

  return (
    <div className="space-y-2.5 pt-2 border-t border-neutral-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
          <Radio className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Stories & Destaques</span>
        </div>
        <span className="text-[10px] font-mono-tech text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-full border border-[#8B5CF6]/20">
          Disponível na análise completa
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
        {placeholders.map((item) => (
          <div
            key={item.id}
            onClick={onUnlock}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="w-full h-full rounded-full bg-neutral-900 overflow-hidden relative flex items-center justify-center">
                {/* Synthetic heavily blurred aesthetic gradient (no identifiable faces/data) */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 scale-125"
                  style={{ filter: 'blur(14px) brightness(0.55)' }}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white/90">
                  <Lock className="w-4 h-4 text-[#A78BFA]" />
                </div>
              </div>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium group-hover:text-white transition-colors">
              Bloqueado
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-center text-neutral-500 italic">
        Visualizador anônimo e histórico de stories sincronizados no dossiê completo.
      </p>
    </div>
  );
};

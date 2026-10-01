import React from 'react';
import { Lock, ShieldAlert, Sparkles } from 'lucide-react';
import type { DataOrigin } from '../../services/instagramProfile';

interface PrivateProfilePlaceholderProps {
  onUnlock?: () => void;
}

interface SyntheticConnectionItem {
  id: number;
  origin: DataOrigin;
  genericName: string;
  category: string;
}

export const PrivateProfilePlaceholder: React.FC<PrivateProfilePlaceholderProps> = ({ onUnlock }) => {
  // Synthetic demonstration items strictly marked with origin: 'placeholder'
  const demoItems: SyntheticConnectionItem[] = [
    { id: 1, origin: 'placeholder', genericName: 'Marina', category: 'Interação Frequente' },
    { id: 2, origin: 'placeholder', genericName: 'Lucas', category: 'Conexão Mútua' },
    { id: 3, origin: 'placeholder', genericName: 'Ana', category: 'Atividade Recente' },
    { id: 4, origin: 'placeholder', genericName: 'Gabriel', category: 'Interação Noturna' },
  ];

  return (
    <div className="space-y-3 p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-[#60A5FA]" />
          <span>Conexões & Interações</span>
        </div>
        <span className="text-[10px] font-mono-tech text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
          Prévia ilustrativa
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {demoItems.map((item) => (
          <div
            key={item.id}
            onClick={onUnlock}
            className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60 text-center space-y-1.5 cursor-pointer hover:border-neutral-700 transition-all relative overflow-hidden group"
          >
            {/* Synthetic blurred avatar */}
            <div className="relative mx-auto w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-slate-800 to-indigo-950">
              <div
                className="w-full h-full bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900"
                style={{ filter: 'blur(14px) brightness(0.55)' }}
              />
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-[#60A5FA]" />
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-neutral-200">
                {item.genericName}
              </p>
              <span className="inline-block text-[9px] text-[#94A3B8] font-mono-tech">
                🔒 Bloqueado
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-900">
        <span className="flex items-center gap-1 text-[#60A5FA]">
          <Sparkles className="w-3 h-3" />
          Dossiê analítico decodifica padrões sem notificar
        </span>
        <span className="text-neutral-500">
          100% Anônimo
        </span>
      </div>
    </div>
  );
};

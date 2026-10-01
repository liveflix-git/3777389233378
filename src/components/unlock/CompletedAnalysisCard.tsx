import React from 'react';

interface CompletedAnalysisCardProps {
  username?: string;
}

export const CompletedAnalysisCard: React.FC<CompletedAnalysisCardProps> = () => {
  return (
    <div className="w-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 rounded-[20px] p-4 text-center shadow-[0_10px_30px_rgba(139,92,246,0.15)] flex flex-col items-center justify-center space-y-1.5 select-none my-4">
      <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center gap-2">
        <span>Espionagem 100% finalizada!</span>
        <span className="text-lg">🥳</span>
      </h3>

      <p className="text-xs sm:text-sm text-[#D1D5DB] font-medium leading-relaxed">
        Adquira seu acesso VIP e tenha acesso imediatamente a:
      </p>
    </div>
  );
};

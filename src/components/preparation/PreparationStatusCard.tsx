import React from 'react';
import { Loader2, Check } from 'lucide-react';

interface PreparationStatusCardProps {
  isComplete: boolean;
}

export const PreparationStatusCard: React.FC<PreparationStatusCardProps> = ({
  isComplete,
}) => {
  const displayTitle = isComplete
    ? 'Criptografia quebrada com sucesso!'
    : 'Quebrando criptografia da conta';

  const displaySubtitle = isComplete
    ? 'Acesso liberado à conta!'
    : 'Testando senha...';

  return (
    <div className="w-full bg-[#0F141A] border border-[#232C36] rounded-[8px] p-3 text-left transition-all duration-300 select-none my-2">
      <div className="flex items-center gap-3">
        {/* Left circular icon container with purple styling */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
            isComplete
              ? 'bg-[#A855F7]/20 border-[#A855F7]/50 text-[#C084FC]'
              : 'bg-[#A855F7]/15 border-[#A855F7]/30 text-[#C084FC]'
          }`}
        >
          {isComplete ? (
            <Check className="w-5 h-5 text-[#C084FC] stroke-[2.5]" />
          ) : (
            <Loader2 className="w-5 h-5 text-[#C084FC] animate-spin" />
          )}
        </div>

        {/* Text Area */}
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <h4 className="text-[13.5px] font-semibold text-white leading-tight truncate">
            {displayTitle}
          </h4>
          <p className="text-[11.5px] text-[#8E95A2] leading-tight pt-1 truncate font-normal">
            {displaySubtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

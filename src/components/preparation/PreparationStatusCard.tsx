import React from 'react';
import { Loader2, Check } from 'lucide-react';

interface PreparationStatusCardProps {
  progress: number;
  stageIndex: number;
  isComplete: boolean;
}

const STAGES = [
  { title: 'Validando sessão', subtitle: 'Carregando perfil...' },
  { title: 'Sincronizando informações', subtitle: 'Processando visualização...' },
  { title: 'Preparando ambiente', subtitle: 'Quase pronto...' },
  { title: 'Finalizando análise', subtitle: 'Validando acesso ao perfil' },
  { title: 'Processo concluído', subtitle: 'Redirecionando para a conta' },
];

export const PreparationStatusCard: React.FC<PreparationStatusCardProps> = ({
  progress,
  stageIndex,
  isComplete,
}) => {
  const currentStage = STAGES[Math.min(stageIndex, STAGES.length - 1)];

  const displayTitle = isComplete ? 'Processo concluído' : currentStage.title;
  const displaySubtitle = isComplete ? 'Redirecionando para a conta' : currentStage.subtitle;

  return (
    <div className="w-full bg-[#0F141A] border border-[#232C36] rounded-[8px] p-3.5 text-left transition-all duration-300 select-none my-2">
      <div className="flex items-center gap-3">
        {/* Left circular icon container in purple or green */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
            isComplete
              ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
              : 'bg-[#A855F7]/15 border-[#A855F7]/30 text-[#C084FC]'
          }`}
        >
          {isComplete ? (
            <Check className="w-4 h-4 text-[#22C55E]" />
          ) : (
            <Loader2 className="w-4 h-4 text-[#C084FC] animate-spin" />
          )}
        </div>

        {/* Text Area */}
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="text-[13.5px] font-semibold text-white leading-tight truncate flex items-center gap-1.5">
            {isComplete && <span className="text-[#22C55E]">✓</span>}
            <span>{displayTitle}</span>
          </h4>
          <p className="text-[11px] text-[#8E95A2] leading-tight pt-0.5 truncate font-normal">
            {displaySubtitle}
          </p>
        </div>

        {/* Percentage Badge */}
        <span className="text-[11px] font-mono font-medium text-[#6B7280] shrink-0">
          {Math.min(progress, 100)}%
        </span>
      </div>

      {/* Subtle Progress Bar */}
      <div className="w-full h-[3px] bg-[#18202A] rounded-full overflow-hidden mt-2.5">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: isComplete
              ? '#22C55E'
              : 'linear-gradient(90deg, #8B5CF6, #A855F7)',
          }}
        />
      </div>
    </div>
  );
};

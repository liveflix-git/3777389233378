import React from 'react';
import { Play } from 'lucide-react';

interface AudioMessageCardProps {
  duration: string;
  onTranscriptionClick: () => void;
}

export const AudioMessageCard: React.FC<AudioMessageCardProps> = ({
  duration,
  onTranscriptionClick,
}) => {
  // Static waveform bars pattern representing audio waveform
  const barHeights = [
    'h-2', 'h-4', 'h-6', 'h-3', 'h-7', 'h-5', 'h-8', 'h-4', 'h-6', 'h-3',
    'h-5', 'h-7', 'h-4', 'h-6', 'h-2', 'h-5', 'h-7', 'h-3', 'h-6', 'h-4'
  ];

  return (
    <div className="max-w-[85%] p-3.5 rounded-[22px] rounded-tl-[4px] bg-[#262626] text-white border border-white/5 shadow-sm space-y-2 select-none">
      <div className="flex items-center gap-3">
        {/* Purple Play Button */}
        <button
          type="button"
          onClick={onTranscriptionClick}
          className="w-9 h-9 rounded-full bg-[#7000FF] hover:bg-[#6000E0] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-transform active:scale-95"
          aria-label="Reproduzir áudio"
        >
          <Play className="w-4 h-4 fill-white translate-x-0.5" />
        </button>

        {/* Waveform Visualization */}
        <div className="flex-1 flex items-center gap-[3px] h-8 overflow-hidden">
          {barHeights.map((hClass, idx) => (
            <span
              key={idx}
              className={`w-[2.5px] ${hClass} bg-white/90 rounded-full transition-all`}
            />
          ))}
        </div>

        {/* Audio Duration */}
        <span className="text-[12px] font-mono text-neutral-300 shrink-0 font-medium">
          {duration}
        </span>
      </div>

      {/* Transcription Link */}
      <div className="pt-0.5 flex items-center justify-start">
        <button
          type="button"
          onClick={onTranscriptionClick}
          className="text-[11.5px] font-semibold text-[#3797F0] hover:underline cursor-pointer flex items-center gap-1 transition-colors"
        >
          <span>Ver transcrição</span>
        </button>
      </div>
    </div>
  );
};

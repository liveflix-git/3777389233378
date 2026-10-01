import React from 'react';

export interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  creditCost: string;
  accentColor?: string;
  badgeStyle?: string;
  className?: string;
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  creditCost,
  accentColor = 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30',
  badgeStyle = 'bg-[#8B5CF6]/15 text-[#C084FC] border-[#8B5CF6]/30',
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group bg-[#0B1011] border border-[#202627] rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8B5CF6]/40 hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between min-h-[175px] select-none ${className}`}
    >
      {/* Top row: Icon + Title */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-transform duration-200 group-hover:scale-105 ${accentColor}`}
          >
            {icon}
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight group-hover:text-[#C084FC] transition-colors">
          {title}
        </h3>

        <p className="text-xs sm:text-[13px] text-[#9CA3AF] leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Bottom badge */}
      <div className="pt-3 flex items-center justify-start">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}
        >
          {creditCost}
        </span>
      </div>
    </div>
  );
};

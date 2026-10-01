import React from 'react';
import { X, Lock, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface LockedFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isCreditPurchase?: boolean;
}

export const LockedFeatureModal: React.FC<LockedFeatureModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  isCreditPurchase = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#0E1318] border border-white/10 rounded-2xl p-6 shadow-2xl text-center space-y-4 select-none">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC]">
          {isCreditPurchase ? (
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
          ) : (
            <Lock className="w-6 h-6 text-[#C084FC]" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-white tracking-tight">
          {title}
        </h3>

        {/* Message */}
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
          {message}
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.98] transition-all font-bold text-white text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Entendido</span>
        </button>
      </div>
    </div>
  );
};

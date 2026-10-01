import React from 'react';
import { Check } from 'lucide-react';

interface OfferCardProps {
  username: string;
  targetName?: string;
  onOpenCheckout: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  username,
  targetName = 'teste',
  onOpenCheckout,
}) => {
  const displayName = targetName || username;

  const benefits = [
    `Todas as mensagens do direct de ${displayName}`,
    'Todas as fotos sem censura (incluindo apagadas)',
    'Localização em tempo real e locais que esteve',
    `Alerta sempre que ${displayName} interagir com alguém`,
    '2 bônus surpresa avaliados em R$120,00',
  ];

  return (
    <div className="w-full select-none space-y-4 my-6">
      {/* Headline */}
      <div className="text-center px-2">
        <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
          Com o <span className="text-[#823BF6]">ESPIA AÍ APP</span> você vai ter acesso completo ao instagram de{' '}
          <span className="text-white">{displayName}</span> por apenas:
        </h2>
      </div>

      {/* Price Box */}
      <div className="w-full bg-[#101418] border border-[#823BF6]/40 rounded-2xl p-5 text-center shadow-[0_0_30px_rgba(130,59,246,0.15)] space-y-2">
        <div className="text-xs sm:text-sm text-[#9CA3AF] line-through font-medium">
          De: R$ 279,90
        </div>

        <div className="flex items-baseline justify-center gap-1 my-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#823BF6]">
            R$
          </span>
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#823BF6]">
            47
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#823BF6]">
            ,90
          </span>
        </div>

        {/* Tags Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-[#9CA3AF] font-medium pt-1 flex-wrap">
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[#823BF6] stroke-[3]" />
            <span>Pagamento único</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[#823BF6] stroke-[3]" />
            <span>Acesso imediato</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[#823BF6] stroke-[3]" />
            <span>Pagamento seguro</span>
          </span>
        </div>
      </div>

      {/* Benefits List Cards */}
      <div className="space-y-2.5 pt-1">
        {benefits.map((item, idx) => (
          <div
            key={idx}
            className="w-full bg-[#101418] border border-white/10 rounded-xl p-3.5 flex items-center gap-3 text-left shadow-md"
          >
            <Check className="w-4 h-4 text-[#823BF6] stroke-[3] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Big Main CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenCheckout}
          className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#823BF6] via-[#702AE3] to-[#5C1BD0] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(130,59,246,0.5)] cursor-pointer text-center flex flex-col items-center justify-center gap-0.5"
        >
          <span className="text-base sm:text-lg font-black text-white tracking-wide">
            Acessar tudo agora mesmo
          </span>
          <span className="text-xs text-white/80 font-normal">
            Acesso liberado em até 2 minutos
          </span>
        </button>
      </div>
    </div>
  );
};

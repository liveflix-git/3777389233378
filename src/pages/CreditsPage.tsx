import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  Check,
  Flame,
  ShieldCheck,
  Star,
  Infinity,
  Sparkles,
  QrCode,
  CreditCard,
  Lock,
  X,
  CheckCircle2,
} from 'lucide-react';
import { MatrixBackground } from '../components/MatrixBackground';
import { getDashboardUser, fetchCurrentUserApi, type DashboardUser } from '../services/espiaSession';

interface CreditPackage {
  id: string;
  credits: string;
  isUnlimited?: boolean;
  price: string;
  oldPrice?: string;
  badge?: string;
  bonus?: string;
  savings?: string;
  features: string[];
  highlight?: boolean;
  buttonGradient?: string;
}

export const CreditsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<DashboardUser>(getDashboardUser());
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  React.useEffect(() => {
    fetchCurrentUserApi().then(setUser);
  }, []);

  const creditPackages: CreditPackage[] = [
    {
      id: 'pack_100',
      credits: '100 Créditos',
      price: 'R$ 39,90',
      features: [
        'Créditos nunca expiram',
        'Acesso a todos os serviços',
      ],
      buttonGradient: 'bg-[#20282D] hover:bg-[#2A343B] text-white',
    },
    {
      id: 'pack_600',
      credits: '600 Créditos',
      price: 'R$ 79,90',
      oldPrice: 'R$ 209,30',
      bonus: '+ 100 Créditos Bônus',
      savings: 'Economize R$ 129,40',
      features: [
        'Créditos nunca expiram',
        'Acesso a todos os serviços',
        '+ 100 Créditos Bônus grátis',
      ],
      buttonGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white',
    },
    {
      id: 'pack_1500',
      credits: '1.500 Créditos',
      price: 'R$ 129,90',
      oldPrice: 'R$ 538,20',
      badge: 'MAIS VENDIDO',
      bonus: '+ 300 Créditos Bônus',
      savings: 'Economize R$ 408,30',
      highlight: true,
      features: [
        'Créditos nunca expiram',
        'Acesso a todos os serviços',
        '+ 300 Créditos Bônus grátis',
        'Suporte VIP prioritário 24/7',
      ],
      buttonGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-white font-black',
    },
    {
      id: 'pack_5000',
      credits: '5.000 Créditos',
      price: 'R$ 299,90',
      oldPrice: 'R$ 1.794,00',
      bonus: 'Economia Máxima',
      savings: 'Economize R$ 1.494,10',
      features: [
        'Créditos nunca expiram',
        'Acesso a todos os serviços',
        'Melhor custo por crédito',
        'Processamento Ultra Rápido',
      ],
      buttonGradient: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white',
    },
    {
      id: 'pack_infinite',
      credits: 'Créditos Infinitos',
      isUnlimited: true,
      price: 'R$ 49,90',
      badge: 'ACESSO ILIMITADO',
      features: [
        'Uso ilimitado sem restrição',
        'Acesso a todos os serviços e módulos',
        'Análises e investigações sem limites',
        'Sem necessidade de recargas futuras',
      ],
      buttonGradient: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-white font-black',
    },
  ];

  const handleBuyClick = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
  };

  const handleSimulatePayment = () => {
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#05090C] text-[#F5F7FA] font-sans selection:bg-[#2563EB]/30 overflow-x-hidden flex flex-col justify-between">
      {/* Background cyber effect */}
      <MatrixBackground opacity={0.25} speed={0.3} />

      <div className="relative z-10 w-full flex-1">
        {/* HEADER */}
        <header className="sticky top-0 z-40 h-[65px] bg-[#0C1114] border-b border-[#20282D] px-4 sm:px-6 flex items-center justify-between select-none shadow-md">
          <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-semibold hidden sm:inline">Voltar</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
                RECARGA DE CRÉDITOS
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-xs font-bold text-[#3B82F6]">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{user.credits} Créditos</span>
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
          {/* TITLE & HERO BANNER */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Oferta por tempo limitado</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Escolha seu pacote de créditos
            </h1>
            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
              Recarregue seus créditos para desbloquear relatórios, acelerar análises no Instagram e acessar os módulos de espionagem com liberação instantânea.
            </p>
          </div>

          {/* GRID DE PACOTES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {creditPackages.map((pkg) => {
              const isHighlight = pkg.highlight;
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                    isHighlight
                      ? 'bg-gradient-to-b from-[#181308] via-[#0C1114] to-[#0C1114] border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.25)] scale-[1.02]'
                      : pkg.isUnlimited
                      ? 'bg-gradient-to-b from-[#061812] via-[#0C1114] to-[#0C1114] border-2 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                      : 'bg-[#0C1114] border border-[#20282D] hover:border-[#3B82F6]/50 shadow-xl'
                  }`}
                >
                  {/* BADGE DE DESTAQUE */}
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black">
                      <Star className="w-3.5 h-3.5 fill-black" />
                      <span>{pkg.badge}</span>
                    </div>
                  )}

                  <div className="space-y-4 pt-1">
                    {/* CARD HEADER */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                          {pkg.isUnlimited ? (
                            <>
                              <Infinity className="w-5 h-5 text-emerald-400" />
                              <span>{pkg.credits}</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                              <span>{pkg.credits}</span>
                            </>
                          )}
                        </h3>
                        {pkg.bonus && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                            {pkg.bonus}
                          </span>
                        )}
                      </div>

                      {/* ECONOMIA DESTAQUE */}
                      {pkg.savings && (
                        <p className="text-xs font-bold text-emerald-400">
                          {pkg.savings}
                        </p>
                      )}
                    </div>

                    {/* PRICE BLOCK */}
                    <div className="p-3.5 rounded-xl bg-[#05090C] border border-[#20282D] space-y-1">
                      {pkg.oldPrice && (
                        <span className="text-xs text-[#9CA3AF] line-through font-medium block">
                          De {pkg.oldPrice}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-white">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-[#9CA3AF]">/ pagamento único</span>
                      </div>
                    </div>

                    {/* FEATURES LIST */}
                    <ul className="space-y-2.5 pt-2">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#D1D5DB]">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* BUY BUTTON */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => handleBuyClick(pkg)}
                      className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${pkg.buttonGradient}`}
                    >
                      <span>Comprar Agora</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECURE FOOTER NOTE */}
          <div className="p-4 rounded-2xl bg-[#0C1114] border border-[#20282D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Pagamento 100% Seguro • Liberação Imediata dos Créditos • Sem Assinaturas Recorrentes</span>
            </div>
            <img
              src="https://i.ibb.co/bMcW4Ryc/formas-pagamento.png"
              alt="Formas de pagamento"
              className="h-8 w-auto object-contain"
            />
          </div>
        </main>
      </div>

      {/* CHECKOUT MODAL */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0C1114] border border-[#20282D] rounded-2xl p-6 sm:p-8 shadow-2xl text-left space-y-6 select-none">
            <button
              type="button"
              onClick={() => setSelectedPackage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccessModalOpen ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
                    RECARGA INSTANTÂNEA
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    {selectedPackage.credits}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    {selectedPackage.oldPrice && (
                      <span className="text-xs text-[#9CA3AF] line-through">
                        {selectedPackage.oldPrice}
                      </span>
                    )}
                    <span className="text-2xl font-black text-white">
                      {selectedPackage.price}
                    </span>
                  </div>
                </div>

                {/* SELECTOR FORMA PAGAMENTO */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#05090C] rounded-xl border border-[#20282D]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'pix'
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    PIX
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Cartão
                  </button>
                </div>

                {paymentMethod === 'pix' ? (
                  <div className="p-4 rounded-xl bg-[#05090C] border border-[#20282D] text-center space-y-3">
                    <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-black" />
                    </div>
                    <p className="text-xs text-[#9CA3AF]">
                      Escaneie o QR Code no seu banco ou clique abaixo para liberar seus créditos instantaneamente.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <input
                      type="text"
                      placeholder="Número do Cartão (0000 0000 0000 0000)"
                      className="w-full px-3.5 py-3 rounded-xl bg-[#05090C] border border-[#20282D] text-white placeholder-[#6B7280] outline-none focus:border-[#3B82F6]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Validade (MM/AA)"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#05090C] border border-[#20282D] text-white placeholder-[#6B7280] outline-none focus:border-[#3B82F6]"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#05090C] border border-[#20282D] text-white placeholder-[#6B7280] outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm tracking-wide transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pagar {selectedPackage.price} e Liberar</span>
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">Pagamento Confirmado!</h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Seus créditos foram liberados em sua conta.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    setSelectedPackage(null);
                    navigate('/dashboard');
                  }}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
                >
                  Voltar para o Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Lock, ArrowRight, Zap } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  planName,
}) => {
  const [method, setMethod] = useState<'pix' | 'card'>('pix');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const price = planName.includes('VIP') ? '49,90' : '34,79';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0B0B10] border border-[rgba(139,92,246,0.3)] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(139,92,246,0.25)] text-[#F8FAFC]">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#A855F7]">
                Desbloqueio Imediato
              </span>
              <h3 className="text-xl font-bold font-display text-white mt-1">
                {planName}
              </h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-sm text-[#9CA3AF]">Valor:</span>
                <span className="text-2xl font-bold font-display text-white">R$ {price}</span>
                <span className="text-xs text-emerald-400 font-mono-tech">· Acesso Instantâneo</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#050507] rounded-xl border border-[rgba(139,92,246,0.18)]">
              <button
                type="button"
                onClick={() => setMethod('pix')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  method === 'pix' ? 'bg-[#8B5CF6] text-white shadow-sm' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                PIX Automático
              </button>
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  method === 'card' ? 'bg-[#8B5CF6] text-white shadow-sm' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Cartão de Crédito
              </button>
            </div>

            {/* Pix Instructions */}
            {method === 'pix' ? (
              <div className="space-y-4 bg-[#050507] p-4 rounded-2xl border border-[rgba(139,92,246,0.12)]">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Acesso liberado automaticamente em menos de 10s após o PIX.</span>
                </div>

                <div className="p-3 bg-white rounded-xl flex items-center justify-center max-w-[160px] mx-auto shadow-inner">
                  <div className="w-32 h-32 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-center p-2">
                    <QrCode className="w-16 h-16 text-white mb-1" />
                    <span className="text-[9px] text-[#9CA3AF] font-mono-tech">QR Code Demo</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSuccess(true)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                >
                  <span>Simular Pagamento PIX</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Card Form */
              <div className="space-y-3 bg-[#050507] p-4 rounded-2xl border border-[rgba(139,92,246,0.12)]">
                <div>
                  <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-[#0B0B10] border border-[rgba(139,92,246,0.2)] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">Validade</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full bg-[#0B0B10] border border-[rgba(139,92,246,0.2)] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#9CA3AF] block mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-[#0B0B10] border border-[rgba(139,92,246,0.2)] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSuccess(true)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] mt-2"
                >
                  <span>Pagar R$ {price}</span>
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#9CA3AF]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transação criptografada de ponta a ponta</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Acesso Liberado!</h3>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Seu relatório e dossiê do perfil foram descriptografados.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#8B5CF6] font-bold text-xs uppercase tracking-wider text-white hover:brightness-110 transition-all"
            >
              Visualizar Dossiê Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

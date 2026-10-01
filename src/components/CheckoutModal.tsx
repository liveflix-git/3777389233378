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

  const price = planName.includes('VIP') ? '49,90' : '29,90';

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

            {method === 'pix' ? (
              <div className="p-4 rounded-2xl bg-[#050507] border border-[rgba(139,92,246,0.2)] text-center space-y-3">
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                  {/* Visual QR representation */}
                  <div className="w-full h-full border-2 border-dashed border-black/30 rounded flex flex-col items-center justify-center text-neutral-900 text-[10px] font-mono-tech p-1">
                    <QrCode className="w-16 h-16 text-black mb-1" />
                    <span>PIX COPIA E COLA</span>
                  </div>
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  Escaneie o QR Code acima ou clique no botão abaixo para simular a liberação instantânea do dossiê.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Número do Cartão (0000 0000 0000 0000)"
                  className="w-full px-3.5 py-3 rounded-xl bg-[#050507] border border-[rgba(139,92,246,0.25)] text-white placeholder-neutral-500 focus:outline-none focus:border-[#8B5CF6]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Validade (MM/AA)"
                    className="w-full px-3.5 py-3 rounded-xl bg-[#050507] border border-[rgba(139,92,246,0.25)] text-white placeholder-neutral-500 focus:outline-none focus:border-[#8B5CF6]"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full px-3.5 py-3 rounded-xl bg-[#050507] border border-[rgba(139,92,246,0.25)] text-white placeholder-neutral-500 focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSuccess(true)}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2"
            >
              <span>Confirmar e Liberar Relatório</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#9CA3AF]">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Criptografia 256-bit
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Garantia 7 Dias
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Acesso Liberado com Sucesso!
            </h3>
            <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto">
              Seu acesso privilegiado ao sistema Stalkeia App foi ativado. As consultas agora são ilimitadas e 100% confidenciais.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors"
            >
              Acessar Painel Investigativo
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

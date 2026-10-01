import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Send, Shield, Zap } from 'lucide-react';
import { getEspiaProfile } from '../services/espiaSession';
import { SocialAppShell } from '../components/social/SocialAppShell';
import { BlockedPopup } from '../components/social/BlockedPopup';
import { CheckoutModal } from '../components/CheckoutModal';

export const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const profile = getEspiaProfile();

  const [isBlockedOpen, setIsBlockedOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!profile) {
    navigate('/');
    return null;
  }

  // Derive masked name from chatId
  const maskedNames: Record<string, string> = {
    chat_1: 'a******',
    chat_2: 'bia****',
    chat_3: 'luc****',
    chat_4: 'car****',
    chat_5: 'fer****',
    chat_6: 'gab****',
  };

  const currentMaskedName = chatId ? maskedNames[chatId] || 'contato_oculto' : 'contato_oculto';

  return (
    <SocialAppShell profile={profile} onBackToSearch={() => navigate('/')}>
      <div className="w-full bg-[#080A0D] min-h-[70vh] flex flex-col justify-between select-none">
        
        {/* Chat Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262A30] bg-[#080A0D] sticky top-14 md:top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/direct')}
              className="p-1 -ml-1 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Voltar para mensagens"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Synthetic blurred avatar */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-indigo-950 to-purple-950 shrink-0 border border-neutral-700">
              <div
                className="w-full h-full scale-125 bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-950"
                style={{ filter: 'blur(12px) brightness(0.5)' }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Lock className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-sm text-white font-mono">
                {currentMaskedName}
              </span>
              <span className="text-[10px] text-[#22C55E] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                Atividade recente detectada
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBlockedOpen(true)}
            className="text-xs font-semibold text-[#EC4899] hover:underline cursor-pointer"
          >
            Desbloquear
          </button>
        </div>

        {/* Chat Bubble Area with central lock overlay */}
        <div 
          onClick={() => setIsBlockedOpen(true)}
          className="relative flex-1 p-4 space-y-4 overflow-hidden min-h-[360px] cursor-pointer group"
        >
          {/* Simulated blurred messages */}
          <div className="space-y-3 pointer-events-none opacity-40 select-none" style={{ filter: 'blur(8px)' }}>
            <div className="flex justify-start">
              <div className="max-w-[70%] p-3 rounded-2xl rounded-tl-sm bg-[#101318] text-white text-xs">
                Oi! Você viu aquilo que te mandei mais cedo?
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[70%] p-3 rounded-2xl rounded-tr-sm bg-[#3B82F6] text-white text-xs">
                Acabei de ver aqui... não acredito haha
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[70%] p-3 rounded-2xl rounded-tl-sm bg-[#101318] text-white text-xs">
                Depois me conta o que você achou de verdade.
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[70%] p-3 rounded-2xl rounded-tr-sm bg-[#3B82F6] text-white text-xs">
                Pode deixar, te mando um áudio já já!
              </div>
            </div>
          </div>

          {/* Central Lock Overlay */}
          <div className="absolute inset-0 bg-[#080A0D]/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#101318] border border-[#262A30] shadow-[0_0_25px_rgba(0,0,0,0.9)] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6 text-[#EC4899]" />
            </div>

            <div className="space-y-1 max-w-xs">
              <h4 className="text-base font-bold text-white tracking-tight">
                Conversa Criptografada
              </h4>
              <p className="text-xs text-neutral-400">
                Histórico completo de áudios, mídias temporárias e mensagens disponível para membros VIP.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#9333EA] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(236,72,153,0.35)] flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Desbloquear Histórico Completo</span>
            </button>
          </div>
        </div>

        {/* Input Bar (Disabled with VIP notice) */}
        <div className="p-3 border-t border-[#262A30] bg-[#080A0D]">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#101318] border border-[#262A30] opacity-80 cursor-not-allowed">
            <Lock className="w-4 h-4 text-neutral-500 ml-2 shrink-0" />
            <span className="text-xs text-neutral-500 flex-1">
              Envio e visualização liberados no VIP...
            </span>
            <div className="p-1.5 rounded-lg bg-neutral-800 text-neutral-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

      {/* Blocked popup */}
      <BlockedPopup
        isOpen={isBlockedOpen}
        onClose={() => setIsBlockedOpen(false)}
        onVirarVip={() => {
          setIsBlockedOpen(false);
          setIsCheckoutOpen(true);
        }}
        title="Mensagens Criptografadas"
        description="Acesso ao histórico de mensagens diretas e áudios disponível no plano VIP do Espia Aí."
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={`Desbloqueio de Chat · @${profile.username}`}
      />
    </SocialAppShell>
  );
};

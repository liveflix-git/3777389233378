import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Check,
  MessageSquare,
  Image as ImageIcon,
  MapPin,
  Shield,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { CheckoutModal } from '../components/CheckoutModal';
import { getEspiaProfile, getActiveAnalysisApi } from '../services/espiaSession';
import { MatrixBackground } from '../components/MatrixBackground';

export const AntiAlertPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('teste');
  const [displayName, setDisplayName] = useState<string>('teste');
  const [targetAvatar, setTargetAvatar] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    // 1. Try URL parameter
    const queryUsername = searchParams.get('username') || searchParams.get('handle');
    if (queryUsername) {
      const clean = queryUsername.trim().replace(/^@/, '');
      if (clean) {
        setUsername(clean);
        setDisplayName(clean.split('.')[0] || clean);
        return;
      }
    }

    // 2. Try active analysis from backend
    getActiveAnalysisApi('instagram').then((analysis) => {
      if (analysis && analysis.username) {
        setUsername(analysis.username);
        setDisplayName(analysis.username.split('.')[0] || analysis.username);
        return;
      }

      // 3. Try stored Espia Profile
      const storedProfile = getEspiaProfile();
      if (storedProfile && storedProfile.username) {
        setUsername(storedProfile.username.replace(/^@/, ''));
        setDisplayName(storedProfile.fullName || storedProfile.username);
        if (storedProfile.profilePicture) {
          setTargetAvatar(storedProfile.profilePicture);
        }
      }
    });
  }, [searchParams]);

  const formattedUsername = username.startsWith('@') ? username : `@${username}`;

  return (
    <div className="relative min-h-screen bg-[#05090C] text-[#F5F7FA] font-sans selection:bg-[#2563EB]/30 overflow-x-hidden py-8 px-4 sm:px-6 flex flex-col items-center justify-start select-none">
      {/* Background Matrix/Cyber Effect */}
      <MatrixBackground opacity={0.25} speed={0.3} />

      <div className="relative z-10 w-full max-w-[570px] mx-auto space-y-6 text-center">
        {/* LOGO ESPIA AÍ & BADGE DE VERIFICAÇÃO */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <img
            src="/espia-logo.png"
            alt="Espia Aí Logo"
            className="w-28 sm:w-36 h-auto object-contain mx-auto drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          />

          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/40 text-[#3B82F6] font-extrabold text-xs tracking-wider uppercase shadow-sm">
            VERIFICAÇÃO ANTI-ALERTA
          </div>
        </div>

        {/* CARD 1: ALERTA PRINCIPAL */}
        <div className="bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-5 text-center relative overflow-hidden">
          {/* Top Warning Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/35 flex items-center justify-center text-[#3B82F6]">
            <AlertTriangle className="w-7 h-7" />
          </div>

          {/* Big Headline */}
          <h1 className="text-xl sm:text-2xl font-black leading-snug tracking-tight text-white uppercase">
            {formattedUsername} VAI RECEBER UM ALERTA DIZENDO QUE VOCÊ ESTÁ MONITORANDO!
          </h1>

          {/* CUIDADO Badge */}
          <div className="inline-block px-4 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-extrabold text-xs tracking-widest uppercase">
            CUIDADO
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-3 text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-lg mx-auto">
            <p>
              Na versão gratuita o perfil que você está investigando pode receber uma notificação falando que você está investigando ele.
            </p>
            <p>
              Não deixe isso acontecer. Assine a versão paga do aplicativo e não deixe que o perfil receba uma notificação falando que você tentou monitorar.
            </p>
          </div>

          {/* Highlight Boxes */}
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#05090C] border border-[#20282D] text-xs sm:text-sm font-semibold text-white/90 leading-snug">
              Continue monitorando e vendo todo conteúdo que quiser sem que a pessoa seja notificada.
            </div>

            <div className="p-4 rounded-2xl bg-[#05090C] border border-[#20282D] text-xs sm:text-sm font-semibold text-white/90 leading-snug">
              Veja DMs, stories, fotos apagadas, curtidas secretas e localização!
            </div>
          </div>
        </div>

        {/* CARD 2: ALERTA VOCÊ FOI IDENTIFICADO */}
        <div className="bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#3B82F6] tracking-widest uppercase">
            ALERTA: VOCÊ FOI IDENTIFICADO(A)!
          </h2>

          {/* Avatar Comparison */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 py-2">
            {/* User Avatar */}
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2563EB]/20 border-2 border-[#3B82F6] flex items-center justify-center text-[#3B82F6] shadow-lg">
                <User className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">SUA FOTO</span>
              <span className="text-[11px] font-semibold text-white">Verificação deste dispositivo</span>
            </div>

            {/* Arrow */}
            <div className="w-8 h-8 rounded-full bg-[#20282D] flex items-center justify-center text-[#9CA3AF]">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Target Avatar */}
            <div className="flex flex-col items-center space-y-1.5">
              <img
                src={targetAvatar}
                alt={username}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#3B82F6] object-cover shadow-lg"
              />
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">PERFIL MONITORADO</span>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-white">{displayName}</span>
                <span className="text-[11px] font-mono text-[#3B82F6]">{formattedUsername}</span>
              </div>
            </div>
          </div>

          {/* Info Box 1 */}
          <div className="p-4 rounded-2xl bg-[#05090C] border border-[#20282D] text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Esta foto será enviada para o perfil monitorado como prova de que você está tentando acessar as conversas e dados privados do perfil.
          </div>

          {/* Info Box 2 */}
          <div className="p-4 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 text-xs sm:text-sm font-semibold text-[#F5F7FA] leading-relaxed">
            <span className="text-[#3B82F6] font-bold">IMPORTANTE:</span> Para cancelar o envio desta foto e manter total anonimato, assine a versão paga abaixo.
          </div>
        </div>

        {/* CARD 3: RESULTADOS DA ANÁLISE COMPLETA */}
        <div className="bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-5 text-center">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#3B82F6] tracking-widest uppercase">
            RESULTADOS DA ANÁLISE COMPLETA
          </h2>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
            {/* Stat 1 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#05090C] border border-[#20282D] flex flex-col items-center justify-between space-y-2">
              <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
              <span className="text-[10px] sm:text-xs font-bold text-[#9CA3AF] leading-tight">
                Mensagens Suspeitas
              </span>
              <span className="text-xl sm:text-2xl font-black text-white">47</span>
              <span className="text-[9px] sm:text-[10px] text-[#6B7280]">
                conversas com conteúdo íntimo
              </span>
            </div>

            {/* Stat 2 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#05090C] border border-[#20282D] flex flex-col items-center justify-between space-y-2">
              <ImageIcon className="w-5 h-5 text-[#3B82F6]" />
              <span className="text-[10px] sm:text-xs font-bold text-[#9CA3AF] leading-tight">
                Fotos Comprometedoras
              </span>
              <span className="text-xl sm:text-2xl font-black text-white">23</span>
              <span className="text-[9px] sm:text-[10px] text-[#6B7280]">
                imagens e mini-clipes íntimos
              </span>
            </div>

            {/* Stat 3 */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#05090C] border border-[#20282D] flex flex-col items-center justify-between space-y-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span className="text-[10px] sm:text-xs font-bold text-[#9CA3AF] leading-tight">
                Localizações Suspeitas
              </span>
              <span className="text-xl sm:text-2xl font-black text-white">2</span>
              <span className="text-[9px] sm:text-[10px] text-[#6B7280]">
                lugares comprometedores
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: OFERTA ESPECIAL */}
        <div className="bg-gradient-to-b from-[#0F172A] to-[#0C1114] border border-[#2563EB]/40 rounded-[24px] p-6 sm:p-8 shadow-[0_0_30px_rgba(37,99,235,0.2)] space-y-5 text-center">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase">
              OFERTA ESPECIAL PARA VOCÊ!
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Desconto exclusivo por tempo limitado
            </p>
          </div>

          {/* Pricing Box */}
          <div className="space-y-2 pt-2">
            <p className="text-xs text-[#6B7280] line-through font-semibold">
              De R$ 79,90
            </p>

            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-[#9CA3AF] font-bold">6x de</span>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                R$ 5,50
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold uppercase">
                56% OFF
              </span>
            </div>

            <p className="text-xs text-[#9CA3AF] font-medium">
              ou <strong className="text-white">R$ 37,00 à vista</strong>
            </p>
          </div>

          {/* CTA BUTTON */}
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_0_25px_rgba(37,99,235,0.4)] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-sm sm:text-base">SIM, QUERO MONITORAR SEM SER DESCOBERTO!</span>
            <span className="text-[10px] sm:text-xs font-semibold opacity-90">CLIQUE AQUI PARA TER ACESSO COMPLETO E ANÔNIMO</span>
          </button>

          <p className="text-[11px] text-[#9CA3AF] font-medium pt-1">
            Garantia de 7 dias. Se não funcionar, devolvemos 100% do seu dinheiro.
          </p>
        </div>

        {/* CARD 5: EVIDÊNCIAS E RECURSOS */}
        <div className="bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-5 text-left">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#3B82F6] tracking-wider uppercase text-center leading-snug">
            SE VOCÊ QUER TER ACESSO A TODAS ESSAS EVIDÊNCIAS SEM SER DESCOBERTO, PRESTE ATENÇÃO...
          </h2>

          <div className="space-y-3 pt-2">
            {/* Check 1 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2563EB]/20 border border-[#2563EB] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-snug">
                Acesso completo às DMs, Stories e fotos do Instagram sem deixar rastros ou alertas
              </p>
            </div>

            {/* Check 2 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2563EB]/20 border border-[#2563EB] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-snug">
                Localização em tempo real e histórico de lugares visitados (incluindo endereços suspeitos)
              </p>
            </div>

            {/* Check 3 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2563EB]/20 border border-[#2563EB] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-snug">
                Todas as fotos do celular, incluindo imagens íntimas já detectadas
              </p>
            </div>

            {/* Check 4 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2563EB]/20 border border-[#2563EB] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-snug">
                Conversas deletadas recuperadas e áudios comprometedores
              </p>
            </div>

            {/* Check 5 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2563EB]/20 border border-[#2563EB] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-white font-bold leading-snug">
                TOTAL ANONIMATO — A pessoa nunca saberá que está sendo monitorada
              </p>
            </div>
          </div>
        </div>

        {/* CARD 6: A DECISÃO ESTÁ NAS SUAS MÃOS */}
        <div className="bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-5 text-center">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#3B82F6] tracking-wider uppercase">
            A DECISÃO ESTÁ NAS SUAS MÃOS...
          </h2>

          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Você pode continuar arriscando ser descoberto na versão gratuita, ou garantir total anonimato com a versão paga.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-4 rounded-2xl bg-[#05090C] border border-[#20282D] text-xs sm:text-sm text-white/90 leading-snug">
              <strong className="text-rose-400">ATENÇÃO:</strong> Na versão gratuita, o perfil pode receber um alerta sobre o monitoramento!
            </div>

            <div className="p-4 rounded-2xl bg-[#05090C] border border-[#20282D] text-xs sm:text-sm text-white/90 leading-snug">
              <strong className="text-amber-400">LEMBRE-SE:</strong> O perfil monitorado pode descobrir que você está monitorando!
            </div>
          </div>
        </div>

        {/* CARD 7: ÚLTIMA OPORTUNIDADE */}
        <div className="bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-5 text-center">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-extrabold text-[#3B82F6] tracking-widest uppercase">
              ÚLTIMA OPORTUNIDADE!
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              Não deixe ser descoberto! Garanta seu anonimato agora!
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_0_25px_rgba(37,99,235,0.4)] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-sm sm:text-base">GARANTIR ANONIMATO TOTAL AGORA!</span>
            <span className="text-[10px] sm:text-xs font-semibold opacity-90">ÚLTIMA CHANCE DE EVITAR SER DESCOBERTO</span>
          </button>
        </div>

        {/* CARD 8: RISCO DE SER DESCOBERTO */}
        <div className="bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-4 text-center">
          <h2 className="text-xs sm:text-sm font-extrabold text-rose-400 tracking-wider uppercase">
            RISCO DE SER DESCOBERTO!
          </h2>

          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Sem a versão paga, você corre o risco de o perfil receber uma notificação como esta:
          </p>

          <div className="p-4 rounded-2xl bg-[#05090C] border border-[#20282D] text-xs sm:text-sm italic font-medium text-white/90">
            “Alguém está tentando acessar suas conversas e fotos do Instagram”
          </div>

          <p className="text-xs sm:text-sm font-bold text-white pt-1">
            Não deixe isso acontecer! Garanta já sua versão paga!
          </p>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName="Plano Anti-Alerta Anonimato VIP"
      />
    </div>
  );
};

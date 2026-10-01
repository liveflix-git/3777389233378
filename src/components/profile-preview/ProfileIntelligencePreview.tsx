import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2, Eye } from 'lucide-react';
import type { InstagramProfileData } from '../../services/instagramProfile';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { RelatedProfiles } from './RelatedProfiles';
import { RecentContentPreview } from './RecentContentPreview';
import { StoryPreview } from './StoryPreview';
import { PrivateProfilePlaceholder } from './PrivateProfilePlaceholder';
import { LockedAnalysisCard } from './LockedAnalysisCard';
import { UnlockCTA } from './UnlockCTA';

interface ProfileIntelligencePreviewProps {
  profile: InstagramProfileData;
  onConfirmScan: () => void;
  onReset: () => void;
  onOpenCheckout?: () => void;
}

export const ProfileIntelligencePreview: React.FC<ProfileIntelligencePreviewProps> = ({
  profile,
  onConfirmScan,
  onReset,
  onOpenCheckout,
}) => {
  return (
    <div className="space-y-4 py-1 animate-fadeIn max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
      
      {/* 1. Header de Status: Perfil Localizado */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs font-mono-tech uppercase tracking-wider text-[#22C55E]">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span>Perfil Localizado</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Alterar @</span>
        </button>
      </div>

      {/* 2. Card Principal do Perfil */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#000000] border border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-4">
        {/* Header: Foto, Nome, @, Badges e Bio */}
        <ProfileHeader profile={profile} />

        {/* Estatísticas Públicas Oficiais */}
        <ProfileStats profile={profile} />

        {/* 3. Perfis Relacionados Reais do Provider (oculto se não existirem) */}
        {profile.relatedProfiles && profile.relatedProfiles.length > 0 && (
          <RelatedProfiles relatedProfiles={profile.relatedProfiles} />
        )}

        {/* 4. Conteúdo Recente Real (ou aviso de privado/indisponível) */}
        <RecentContentPreview 
          latestPosts={profile.latestPosts} 
          isPrivate={profile.isPrivate} 
        />

        {/* 5. Stories & Destaques (área com preview bloqueada de demonstração) */}
        <StoryPreview onUnlock={onConfirmScan} />

        {/* 6. Demonstração de Conexões em Perfil Privado */}
        {profile.isPrivate && (
          <PrivateProfilePlaceholder onUnlock={onConfirmScan} />
        )}
      </div>

      {/* 7. Card de Análise Avançada Bloqueada */}
      <LockedAnalysisCard 
        username={profile.username} 
        onUnlock={onConfirmScan} 
      />

      {/* Mensagem vermelha de aviso de limite por dispositivo */}
      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#1A0A0C]/90 border border-[#5A181E] text-center flex items-center justify-center gap-2 text-xs sm:text-[12.5px] text-[#EF4444] font-medium leading-snug">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />
        <span>Limite de apenas 1 pesquisa por dispositivo, certifique-se que digitou o usuário corretamente.</span>
      </div>

      {/* 8. Botão Principal de Desbloqueio e Ação */}
      <UnlockCTA 
        username={profile.username} 
        onUnlock={onConfirmScan} 
      />

    </div>
  );
};

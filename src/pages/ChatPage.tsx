import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Phone,
  Video,
  Camera,
  Mic,
  Image as ImageIcon,
  Smile,
  Heart,
  Lock,
  User,
  Sparkles,
} from 'lucide-react';
import { getEspiaProfile } from '../services/espiaSession';
import { CHAT_MOCKS, ChatMessage, getChatMockWithTargetName } from '../data/chatMocks';
import { AudioMessageCard } from '../components/inbox/AudioMessageCard';
import { SensitiveMediaCard } from '../components/inbox/SensitiveMediaCard';
import { VipGateModalDM } from '../components/inbox/VipGateModalDM';
import { SensitiveTextSpan } from '../components/social/SensitiveTextSpan';
import { maskUsername } from '../components/social/SocialStoriesRow';
import { getSearchedProfileDisplayName } from '../utils/profileName';

export const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const profile = getEspiaProfile();

  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipTitle, setVipTitle] = useState('Acesso VIP Requerido');
  const [vipDescription, setVipDescription] = useState(
    'Para ver toda a conversa sem censura, desbloqueie o acesso VIP.'
  );

  const targetFirstName = getSearchedProfileDisplayName(profile);
  const related = (profile?.relatedProfiles || []).filter((p) => p && p.username);

  // Get current mock chat data from fixture with dynamic target name
  const currentMock = getChatMockWithTargetName(chatId || 'chat_1', targetFirstName);

  // Resolve dynamic avatar & name for participant matching DirectPage shifted index
  const getParticipantInfo = () => {
    let dmSlot = 0;
    if (chatId === 'chat_2') dmSlot = 1;
    if (chatId === 'chat_3') dmSlot = 2;

    const index = related.length > 0 ? (dmSlot + 3) % related.length : dmSlot;
    const rel = related[index];
    const name = rel?.username ? maskUsername(rel.username) : currentMock.fallbackName;
    const avatar = rel?.profilePicture || '';

    return { name, avatar };
  };

  const participant = getParticipantInfo();

  const triggerVip = (title: string, description: string) => {
    setVipTitle(title);
    setVipDescription(description);
    setIsVipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#030b14] text-[#F5F5F7] select-none flex flex-col justify-between font-sans relative">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-[#030b14]/95 border-b border-white/[0.08] backdrop-blur-md px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/direct')}
            className="p-1 -ml-1 text-white hover:text-neutral-300 transition-colors cursor-pointer"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          {/* Contact Avatar */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#1F242D] border border-white/10 shrink-0 flex items-center justify-center">
            {participant.avatar ? (
              <img
                src={
                  participant.avatar.startsWith('/api/instagram/') ||
                  !participant.avatar.startsWith('http')
                    ? participant.avatar
                    : `/api/instagram/profile-image?url=${encodeURIComponent(
                        participant.avatar
                      )}`
                }
                alt={participant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-neutral-400" />
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#030b14]" />
          </div>

          {/* Contact Name & Status */}
          <div className="flex flex-col min-w-0 text-left">
            <span className="font-bold text-[15px] text-white tracking-tight leading-tight truncate">
              {participant.name}
            </span>
            <span className="text-[11px] text-[#22C55E] font-medium flex items-center gap-1 leading-tight mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Online
            </span>
          </div>
        </div>

        {/* Action Call Icons */}
        <div className="flex items-center gap-4 text-white">
          <button
            type="button"
            onClick={() =>
              triggerVip(
                'Chamada Restrita',
                'Para ver toda a conversa e realizar chamadas sem censura, desbloqueie o acesso VIP.'
              )
            }
            className="p-1 text-white hover:text-[#3797F0] transition-colors cursor-pointer"
            aria-label="Chamada de voz"
          >
            <Phone className="w-5 h-5 stroke-[1.8]" />
          </button>
          <button
            type="button"
            onClick={() =>
              triggerVip(
                'Chamada em Vídeo Restrita',
                'Para ver toda a conversa e realizar chamadas em vídeo sem censura, desbloqueie o acesso VIP.'
              )
            }
            className="p-1 text-white hover:text-[#3797F0] transition-colors cursor-pointer"
            aria-label="Chamada de vídeo"
          >
            <Video className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* 2. CHAT MESSAGES BODY */}
      <main className="flex-1 w-full max-w-[500px] mx-auto px-4 py-5 pb-28 space-y-3.5">
        
        {/* Top History Locked Gate Banner */}
        <div
          onClick={() =>
            triggerVip(
              'Histórico Completo VIP',
              'Para ver toda a conversa sem censura, desbloqueie o acesso VIP.'
            )
          }
          className="mx-auto my-2 p-3 rounded-xl bg-[#12161F]/90 border border-white/10 text-center text-xs text-neutral-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/20 transition-all shadow-md"
        >
          <div className="flex items-center gap-1.5 text-neutral-400 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#3797F0]" />
            <span>Para ver toda a conversa sem censura, desbloqueie o acesso VIP.</span>
          </div>
          <button
            type="button"
            onClick={() =>
              triggerVip(
                'Histórico Completo VIP',
                'Para ver toda a conversa sem censura, desbloqueie o acesso VIP.'
              )
            }
            className="text-[11.5px] font-bold text-[#3797F0] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 fill-[#3797F0]" />
            <span>Ver Histórico Completo</span>
          </button>
        </div>

        {/* Date Timestamp Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="text-[11px] text-neutral-500 font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-white/[0.03]">
            {chatId === 'chat_3' ? 'Ontem 22:30' : chatId === 'chat_2' ? 'Hoje 11:00' : 'Hoje 14:02'}
          </span>
        </div>

        {/* Message Items Stream */}
        {currentMock.messages.map((msg: ChatMessage) => {
          return (
            <React.Fragment key={msg.id}>
              {msg.sender === 'received' ? (
                /* RECEIVED MESSAGE (LEFT ALIGNED) */
                <div className="flex flex-col items-start space-y-1">
                  {msg.type === 'audio' && (
                    <AudioMessageCard
                      duration={msg.audioDuration || '0:32'}
                      onTranscriptionClick={() =>
                        triggerVip(
                          'Áudio Restrito',
                          'Desbloqueie o VIP para ouvir o áudio completo.'
                        )
                      }
                    />
                  )}

                  {msg.type === 'media' && (
                    <SensitiveMediaCard
                      onMediaClick={() =>
                        triggerVip(
                          'Mídia Bloqueada',
                          'Desbloqueie o VIP para visualizar a mídia completa.'
                        )
                      }
                      reactionEmoji={msg.reaction}
                      imagePreset={msg.imagePreset}
                    />
                  )}

                  {msg.type === 'text' && msg.text && (
                    <div className="relative max-w-[80%] px-3.5 py-2 rounded-[20px] rounded-tl-[4px] bg-[#262626] text-white text-[14px] leading-relaxed shadow-sm">
                      <SensitiveTextSpan text={msg.text} />
                      {msg.reaction && (
                        <div className="absolute -bottom-2.5 -right-1.5 bg-[#1C1C1E] border border-white/10 rounded-full px-1.5 py-0.5 text-[11px] flex items-center gap-0.5 shadow-md">
                          <span>{msg.reaction}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* SENT MESSAGE (RIGHT ALIGNED) */
                <div className="flex flex-col items-end space-y-1">
                  {msg.type === 'heart' ? (
                    <div
                      className="text-4xl py-0.5 select-none cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        triggerVip(
                          'Conversa VIP',
                          'Para ver toda a conversa sem censura, desbloqueie o acesso VIP.'
                        )
                      }
                    >
                      ❤️
                    </div>
                  ) : (
                    <div className="relative max-w-[80%] px-3.5 py-2 rounded-[20px] rounded-tr-[4px] bg-[#3797F0] text-white text-[14px] leading-relaxed shadow-sm">
                      {msg.text && <SensitiveTextSpan text={msg.text} />}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </main>

      {/* 3. FIXED BOTTOM INPUT BAR */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#030b14]/95 border-t border-white/[0.08] backdrop-blur-md p-3 z-30">
        <div className="max-w-[500px] mx-auto flex items-center gap-2 bg-[#1F242D] border border-white/10 rounded-full px-2.5 py-1.5 shadow-lg">
          
          {/* Left Camera Button */}
          <button
            type="button"
            onClick={() =>
              triggerVip(
                'Envio de Mídia Restrito',
                'Para responder e enviar mensagens sem censura, desbloqueie o acesso VIP.'
              )
            }
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7000FF] to-[#3797F0] flex items-center justify-center text-white shrink-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-md"
            aria-label="Câmera"
          >
            <Camera className="w-4 h-4 text-white" />
          </button>

          {/* Message Placeholder Input */}
          <input
            type="text"
            readOnly
            onClick={() =>
              triggerVip(
                'Envio de Mensagem Restrito',
                'Para responder e enviar mensagens sem censura, desbloqueie o acesso VIP.'
              )
            }
            placeholder="Mensagem..."
            className="flex-1 bg-transparent text-white text-[14px] placeholder:text-neutral-400 outline-none px-2 cursor-pointer"
          />

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 text-neutral-300 pr-1">
            <button
              type="button"
              onClick={() =>
                triggerVip(
                  'Áudio Restrito',
                  'Desbloqueie o VIP para ouvir e enviar áudios completos.'
                )
              }
              className="p-1 hover:text-white transition-colors cursor-pointer"
              aria-label="Áudio"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                triggerVip(
                  'Mídia Restrita',
                  'Desbloqueie o VIP para visualizar e enviar fotos sem censura.'
                )
              }
              className="p-1 hover:text-white transition-colors cursor-pointer"
              aria-label="Galeria"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                triggerVip(
                  'Stickers Restritos',
                  'Desbloqueie o VIP para enviar stickers e reações sem censura.'
                )
              }
              className="p-1 hover:text-white transition-colors cursor-pointer"
              aria-label="Stickers"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                triggerVip(
                  'Interação Restrita',
                  'Desbloqueie o VIP para enviar interações sem censura.'
                )
              }
              className="p-1 hover:text-[#EC4899] transition-colors cursor-pointer"
              aria-label="Enviar coração"
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </button>
          </div>
        </div>
      </footer>

      {/* 4. VIP GATE MODAL */}
      <VipGateModalDM
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        title={vipTitle}
        description={vipDescription}
      />
    </div>
  );
};

export default ChatPage;

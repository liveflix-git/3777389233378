import React from 'react';
import { MessageCircle, Phone, Video } from 'lucide-react';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface DirectDemoProps {
  profile: InstagramProfileData;
}

export const DirectDemo: React.FC<DirectDemoProps> = ({ profile }) => {
  const targetName = profile?.fullName
    ? profile.fullName.split(' ')[0]
    : profile?.username || 'o usuário';
  const profilePic =
    profile?.profilePicture ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="w-full space-y-3.5 select-none my-6">
      {/* Title Header with MessageCircle Icon */}
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#9333EA] shrink-0" />
          <span>Mensagens do Direct</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#A0A6B2]">
          Veja literalmente todas as mensagens de {targetName}, incluindo mensagens temporárias
        </p>
      </div>

      {/* Dark Chat Mock Box */}
      <div className="w-full bg-[#101418] border border-white/10 rounded-2xl p-4 shadow-xl space-y-4">
        {/* Header inside chat */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-white/10 shrink-0">
              <img
                src={profilePic}
                alt={targetName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">
                {targetName}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-400 font-medium">
                  online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/80">
            <Phone className="w-5 h-5 cursor-pointer hover:text-white" />
            <Video className="w-5 h-5 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-3 pt-1">
          {/* Left Bubble (Target/Gray) */}
          <div className="max-w-[85%] bg-[#2A2E38] text-white text-[13px] font-normal leading-snug rounded-2xl rounded-tl-sm p-3 shadow-md">
            E aí, bora ver tudo do instagram de {targetName}?
          </div>

          {/* Right Bubble (User/Purple) */}
          <div className="max-w-[85%] ml-auto bg-[#823BF6] text-white text-[13px] font-semibold leading-snug rounded-2xl rounded-tr-sm p-3 shadow-md text-right">
            Boraa, vou comprar meu acesso VIP 🔥
          </div>
        </div>
      </div>
    </div>
  );
};

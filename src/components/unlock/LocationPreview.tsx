import React from 'react';
import { MapPin } from 'lucide-react';
import type { InstagramProfileData } from '../../services/instagramProfile';

interface LocationPreviewProps {
  profile: InstagramProfileData;
  onOpenCheckout?: () => void;
}

export const LocationPreview: React.FC<LocationPreviewProps> = ({ profile, onOpenCheckout }) => {
  const targetName = profile?.fullName
    ? profile.fullName.split(' ')[0]
    : profile?.username || 'o usuário';
  const username = profile?.username || 'usuario';
  const profilePic =
    profile?.profilePicture ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="w-full space-y-3.5 select-none my-6">
      {/* Title Header with Icon */}
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#9333EA] shrink-0" />
          <span>Localização em tempo real</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#A0A6B2]">
          Veja onde {targetName} está agora, e os últimos locais por onde passou.
        </p>
      </div>

      {/* Location Map Card */}
      <div className="w-full bg-[#12161B] border border-white/10 rounded-2xl p-3.5 shadow-xl space-y-3 overflow-hidden">
        {/* Map View Graphic */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#E2E8F0] border border-white/10 flex items-center justify-center">
          {/* Grid map vector simulation */}
          <svg
            className="absolute inset-0 w-full h-full text-slate-300 opacity-90 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M 0 20 L 40 20" fill="none" stroke="#FFFFFF" strokeWidth="3" />
                <path d="M 20 0 L 20 40" fill="none" stroke="#FFFFFF" strokeWidth="3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            {/* Main roads */}
            <path d="M -10 60 Q 150 140 400 30" stroke="#94A3B8" strokeWidth="6" fill="none" />
            <path d="M 80 -10 Q 120 180 240 200" stroke="#94A3B8" strokeWidth="5" fill="none" />
          </svg>

          {/* Center Circular Profile Avatar Pin */}
          <div className="relative z-10 w-14 h-14 rounded-full p-1 bg-white shadow-xl flex items-center justify-center">
            <img
              src={profilePic}
              alt={username}
              className="w-full h-full object-cover rounded-full bg-slate-800"
            />
          </div>
        </div>

        {/* Lower Info & Action */}
        <div className="pt-1 px-1">
          <h4 className="text-base font-bold text-white tracking-tight">
            Localização Atual
          </h4>
          <p className="text-xs text-[#9CA3AF] mt-0.5 font-normal">
            @{username}
          </p>

          <button
            type="button"
            onClick={onOpenCheckout}
            className="mt-3 w-full py-2.5 rounded-xl bg-[#20252D] hover:bg-[#2A303A] text-white text-sm font-medium transition-all active:scale-[0.99] cursor-pointer text-center"
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  );
};

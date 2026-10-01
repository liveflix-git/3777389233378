import React, { useState } from 'react';
import { BadgeCheck, User, Users } from 'lucide-react';
import type { RelatedProfileItem } from '../../services/instagramProfile';

interface RelatedProfilesProps {
  relatedProfiles?: RelatedProfileItem[] | null;
}

export const RelatedProfiles: React.FC<RelatedProfilesProps> = ({ relatedProfiles }) => {
  // If provider did not return related profiles, hide completely as required
  if (!relatedProfiles || !Array.isArray(relatedProfiles) || relatedProfiles.length === 0) {
    return null;
  }

  // Max 5 real suggestions
  const displayItems = relatedProfiles.slice(0, 5);

  return (
    <div className="space-y-2.5 pt-2 border-t border-neutral-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Perfis Relacionados</span>
        </div>
        <span className="text-[10px] font-mono-tech text-[#60A5FA] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full border border-[#3B82F6]/20">
          Dados Públicos
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-neutral-800">
        {displayItems.map((item, idx) => (
          <RelatedProfileCard key={`${item.username}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
};

const RelatedProfileCard: React.FC<{ item: RelatedProfileItem }> = ({ item }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex-shrink-0 w-28 sm:w-32 p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-center space-y-1.5 hover:border-neutral-700 transition-colors">
      <div className="relative mx-auto w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-tr from-neutral-700 to-neutral-500">
        <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
          {!imgError && item.profilePicture ? (
            <img
              src={item.profilePicture}
              alt={`Foto de @${item.username}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className="w-5 h-5 text-neutral-400" />
          )}
        </div>
      </div>

      <div className="space-y-0.5">
        <div className="flex items-center justify-center gap-1">
          <p className="text-xs font-semibold text-white truncate max-w-[90px] font-instagram">
            @{item.username}
          </p>
          {item.isVerified && (
            <BadgeCheck className="w-3 h-3 text-[#0095F6] fill-[#0095F6]/20 shrink-0" />
          )}
        </div>

        {item.fullName && (
          <p className="text-[10px] text-neutral-400 truncate max-w-[100px] font-instagram">
            {item.fullName}
          </p>
        )}
      </div>
    </div>
  );
};

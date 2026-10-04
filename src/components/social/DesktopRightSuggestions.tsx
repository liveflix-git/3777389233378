import React from 'react';
import { BadgeCheck } from 'lucide-react';
import type { InstagramProfileData, RelatedInstagramProfile } from '../../services/instagramProfile';
import { RobustAvatar } from '../../utils/imageHelper';
import { maskUsername } from './SocialStoriesRow';

interface DesktopRightSuggestionsProps {
  profile?: InstagramProfileData | null;
  onSelectSuggestion?: (item: RelatedInstagramProfile) => void;
  onBlockedClick?: () => void;
  onOpenSearch?: () => void;
}

export const DesktopRightSuggestions: React.FC<DesktopRightSuggestionsProps> = ({
  profile,
  onSelectSuggestion,
  onBlockedClick,
  onOpenSearch,
}) => {
  const cleanMainUser = (profile?.username || '').trim().replace(/^@/, '').toLowerCase();

  // Deduplicate and filter target profile
  const validRelated = React.useMemo(() => {
    if (!profile?.relatedProfiles || !Array.isArray(profile.relatedProfiles)) return [];
    const seen = new Set<string>();
    const list: RelatedInstagramProfile[] = [];

    for (const p of profile.relatedProfiles) {
      if (!p || typeof p.username !== 'string') continue;
      const clean = p.username.trim().replace(/^@/, '').toLowerCase();
      if (!clean || clean === cleanMainUser || seen.has(clean)) continue;
      seen.add(clean);
      list.push(p);
    }
    return list;
  }, [profile?.relatedProfiles, cleanMainUser]);

  // Section 9: Se houver dados suficientes (> 5), usar recorte estável diferente dos primeiros stories (ex: slice 3..8)
  const suggestionsList: RelatedInstagramProfile[] = React.useMemo(() => {
    if (validRelated.length >= 6) {
      return validRelated.slice(3, 8);
    }
    if (validRelated.length > 0) {
      // Use existing, and fill remainder with fallback placeholders up to 5
      const result = [...validRelated];
      const fallbackPlaceholders: RelatedInstagramProfile[] = [
        { username: 'perfil_a', isVerified: false, profilePicture: undefined },
        { username: 'conta_b', isVerified: false, profilePicture: undefined },
        { username: 'user_c', isVerified: false, profilePicture: undefined },
        { username: 'perfil_d', isVerified: false, profilePicture: undefined },
        { username: 'conta_e', isVerified: false, profilePicture: undefined },
      ];
      for (const fb of fallbackPlaceholders) {
        if (result.length >= 5) break;
        result.push(fb);
      }
      return result.slice(0, 5);
    }
    // Neutral fallback if zero related profiles returned (strictly neutral, NO stock/fake human photos)
    return [
      { username: 'perfil_a', isVerified: false, profilePicture: undefined },
      { username: 'conta_b', isVerified: false, profilePicture: undefined },
      { username: 'user_c', isVerified: false, profilePicture: undefined },
      { username: 'perfil_d', isVerified: false, profilePicture: undefined },
      { username: 'conta_e', isVerified: false, profilePicture: undefined },
    ];
  }, [validRelated]);

  return (
    <aside className="hidden lg:flex flex-col w-[310px] p-6 space-y-6 text-[#F5F5F5] select-none shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-none bg-[#080B0E]">
      
      {/* 1. Current Target Profile Header with "Mudar" action */}
      {profile && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA] shrink-0">
              <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                <RobustAvatar
                  src={profile.profilePicture}
                  alt={profile.username}
                  usernameContext={profile.username}
                  iconSize={20}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-xs text-white truncate">
                  {profile.username}
                </span>
                {profile.isVerified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-[#0095F6] fill-[#0095F6]/20 shrink-0" />
                )}
              </div>
              {profile.fullName && (
                <p className="text-[11px] text-[#A8A8A8] truncate">
                  {profile.fullName}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSearch}
            className="text-[12px] font-semibold text-[#0095F6] hover:text-[#60A5FA] cursor-pointer transition-colors"
          >
            Mudar
          </button>
        </div>
      )}

      {/* 2. Suggestions list (Real provider data from relatedProfiles) */}
      <div className="space-y-3.5 pt-2 border-t border-[#24282E]/40">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#A8A8A8]">Sugestões para você</span>
          <button
            type="button"
            onClick={onBlockedClick}
            className="text-[11px] font-semibold text-white hover:text-neutral-300 cursor-pointer"
          >
            Ver tudo
          </button>
        </div>

        <div className="space-y-3">
          {suggestionsList.map((item, idx) => (
            <SuggestionItem
              key={`${item.username}-${idx}`}
              item={item}
              onClick={() => {
                if (onSelectSuggestion) onSelectSuggestion(item);
                else if (onBlockedClick) onBlockedClick();
              }}
            />
          ))}
        </div>
      </div>

      {/* 3. Footer Links */}
      <div className="pt-4 space-y-2.5 text-[11px] text-[#A8A8A8]">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:underline cursor-pointer">Sobre</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Ajuda</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Privacidade</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Termos</span>
        </div>
        <p className="text-[10px] text-neutral-600 font-normal">
          © 2026 INSTAGRAM FROM META
        </p>
      </div>

    </aside>
  );
};

const SuggestionItem: React.FC<{
  item: RelatedInstagramProfile;
  onClick: () => void;
}> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-2 p-1 -mx-1 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center shrink-0 border border-[#24282E]/60 group-hover:scale-105 transition-transform">
          <RobustAvatar
            src={item.profilePicture}
            alt={item.username}
            usernameContext={item.username}
            iconSize={14}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-xs text-white truncate max-w-[110px]">
              {maskUsername(item.username)}
            </span>
            {item.isVerified && (
              <BadgeCheck className="w-3 h-3 text-[#0095F6] fill-[#0095F6]/20 shrink-0" />
            )}
          </div>
          {item.fullName && (
            <p className="text-[10px] text-[#A8A8A8] truncate max-w-[120px]">
              {item.fullName}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="text-[11px] font-semibold text-[#0095F6] hover:text-[#60A5FA] cursor-pointer"
      >
        Seguindo
      </button>
    </div>
  );
};

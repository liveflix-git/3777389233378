import React from 'react';
import type { RelatedInstagramProfile } from '../../services/instagramProfile';
import { maskUsername } from '../social/SocialStoriesRow';

export interface NoteItemData {
  id: string;
  noteLines: string[];
  avatarSrc: string;
  handleLabel: string;
  isSelf?: boolean;
}

interface StoryNotesRowProps {
  selfAvatar?: string;
  relatedProfiles?: RelatedInstagramProfile[] | null;
  onNoteClick: (note: NoteItemData) => void;
}

export const StoryNotesRow: React.FC<StoryNotesRowProps> = ({
  selfAvatar,
  relatedProfiles,
  onNoteClick,
}) => {
  const rel = (relatedProfiles || []).filter(p => p && p.username);

  const notes: NoteItemData[] = [
    {
      id: 'note-self',
      noteLines: ['Conte as', 'novidades'],
      avatarSrc: selfAvatar || '',
      handleLabel: 'Sua nota',
      isSelf: true,
    },
    {
      id: 'note-1',
      noteLines: ['Preguiça', 'Hoje 😲'],
      avatarSrc: rel[0]?.profilePicture || '',
      handleLabel: rel[0]?.username ? maskUsername(rel[0].username) : 'ken*****',
    },
    {
      id: 'note-2',
      noteLines: ['📶 (Ao Vivo)', 'Grupo Men...'],
      avatarSrc: rel[1]?.profilePicture || '',
      handleLabel: rel[1]?.username ? maskUsername(rel[1].username) : 'igo*****',
    },
    {
      id: 'note-3',
      noteLines: ['Partiu fim', 'de semana 😈'],
      avatarSrc: rel[2]?.profilePicture || '',
      handleLabel: rel[2]?.username ? maskUsername(rel[2].username) : 'bia*****',
    },
  ];

  return (
    <div
      data-origin="ui-preview"
      className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-2 pb-3 px-3 flex items-start justify-between gap-2 sm:gap-4 select-none"
    >
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onNoteClick(note)}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group active:scale-95 transition-transform"
        >
          {/* Note Bubble Above Avatar */}
          <div className="relative mb-1">
            <div className="bg-[#262626] text-white px-2.5 py-1.5 rounded-2xl text-[11.5px] leading-tight font-medium text-center shadow-lg border border-white/10 max-w-[84px] min-w-[70px] flex flex-col items-center justify-center">
              {note.noteLines.map((line, idx) => (
                <span key={idx} className="truncate w-full">
                  {line}
                </span>
              ))}
            </div>
            {/* Small tail pointing to avatar */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#262626] rotate-45 border-r border-b border-white/10" />
          </div>

          {/* Avatar */}
          <div className="relative w-[62px] h-[62px] rounded-full p-[2px] bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#9333EA]">
            <div className="w-full h-full rounded-full bg-[#000000] p-[2px] overflow-hidden flex items-center justify-center">
              {note.avatarSrc ? (
                <img
                  src={
                    note.avatarSrc.startsWith('/api/instagram/') || !note.avatarSrc.startsWith('http')
                      ? note.avatarSrc
                      : `/api/instagram/profile-image?url=${encodeURIComponent(note.avatarSrc)}`
                  }
                  alt={note.handleLabel}
                  className="w-full h-full object-cover rounded-full bg-neutral-900"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <span className="text-sm font-bold">{note.handleLabel.slice(0, 1).toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Label below avatar */}
          <span className="text-[11px] text-[#A0A6B2] font-medium truncate max-w-[68px] text-center tracking-tight leading-tight font-mono">
            {note.handleLabel}
          </span>
        </div>
      ))}
    </div>
  );
};

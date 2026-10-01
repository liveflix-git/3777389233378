import React from 'react';

export interface NoteItemData {
  id: string;
  noteLines: string[];
  avatarSrc: string;
  handleLabel: string;
  isSelf?: boolean;
}

interface StoryNotesRowProps {
  selfAvatar?: string;
  onNoteClick: (note: NoteItemData) => void;
}

export const StoryNotesRow: React.FC<StoryNotesRowProps> = ({
  selfAvatar,
  onNoteClick,
}) => {
  const notes: NoteItemData[] = [
    {
      id: 'note-self',
      noteLines: ['Conte as', 'novidades'],
      avatarSrc:
        selfAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      handleLabel: 'Sua nota',
      isSelf: true,
    },
    {
      id: 'note-1',
      noteLines: ['Preguiça', 'Hoje 😲'],
      avatarSrc:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
      handleLabel: 'ken*****',
    },
    {
      id: 'note-2',
      noteLines: ['📶 (Ao Vivo)', 'Grupo Men...'],
      avatarSrc:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      handleLabel: 'igo*****',
    },
    {
      id: 'note-3',
      noteLines: ['O vontde', 'fudê a 3 😈'],
      avatarSrc:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
      handleLabel: 'Swi*******',
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
          className="flex flex-col items-center shrink-0 cursor-pointer min-w-[72px] sm:min-w-[82px]"
        >
          {/* Fixed height container for bubble so tails align perfectly */}
          <div className="relative mb-2 flex flex-col items-center justify-end h-[52px] w-full">
            <div
              className={`px-2.5 py-1 rounded-[15px] text-[11px] font-semibold text-center leading-[1.2] shadow-lg relative min-w-[68px] max-w-[84px] flex flex-col items-center justify-center ${
                note.isSelf
                  ? 'bg-[#2A2E38] text-[#9CA3AF]'
                  : 'bg-[#2A2E38] text-white border border-white/5'
              }`}
            >
              {note.noteLines.map((line, i) => (
                <span key={i} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}

              {/* Speech Bubble Tail */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2A2E38] rotate-45 rounded-[1px]" />
            </div>
          </div>

          {/* Avatar Container */}
          <div className="w-[64px] h-[64px] sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden bg-slate-900 border border-white/10 relative shadow-md">
            <img
              src={note.avatarSrc}
              alt={note.handleLabel}
              className={`w-full h-full object-cover ${
                note.isSelf ? '' : 'filter blur-[9px] scale-125'
              }`}
            />
          </div>

          {/* Handle Label Below Avatar */}
          <span className="text-[12px] font-normal text-[#D1D5DB] mt-1.5 text-center truncate max-w-[76px]">
            {note.handleLabel}
          </span>
        </div>
      ))}
    </div>
  );
};

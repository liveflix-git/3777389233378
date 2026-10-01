import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialItem {
  id: string;
  username: string;
  time: string;
  comment: string;
  avatar: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    username: 'Marcosvianad',
    time: '3h',
    comment:
      'Achei q era golpe mas testei msm assim. Paguei, em 3 min recebi o acesso. Tava tudo lá: directs, fotos q ele apagava, até a localização funcionou. Valeu cada centavo.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 't-2',
    username: 'o__prozind34',
    time: '1d',
    comment:
      'Na versão completa testei com @ do boy e vi um monte de coisa. Localização, fotos escondidas, até conversas apagadas. Foi exatamente como mostrou.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 't-3',
    username: 'camila_santos22',
    time: '2d',
    comment:
      'Gente funciona de verdade! Consegui ver os stories dos melhores amigos e as mensagens do direct sem ninguém saber. Recomendo demais!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
];

export const TestimonialDemoCarousel: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIdx];

  return (
    <div className="w-full space-y-3.5 select-none my-6">
      {/* Testimonial Card Container */}
      <div className="w-full bg-[#101418] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 relative">
        {/* User Info Header */}
        <div className="flex items-center gap-3">
          {/* Avatar with Pink/Purple Gradient Ring */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#E1306C] via-[#C13584] to-[#833AB4]">
              <img
                src={current.avatar}
                alt={current.username}
                className="w-full h-full object-cover rounded-full bg-slate-800"
              />
            </div>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-white leading-tight">
              {current.username}
            </span>
            <span className="text-xs text-[#9CA3AF] font-normal mt-0.5">
              {current.time}
            </span>
          </div>
        </div>

        {/* Testimonial Comment Text */}
        <p className="text-[13.5px] sm:text-sm text-white/95 font-normal leading-relaxed text-left">
          {current.comment}
        </p>

        {/* Carousel Dots / Indicators at the bottom center */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {TESTIMONIALS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`transition-all duration-300 cursor-pointer ${
                idx === activeIdx
                  ? 'w-7 h-2.5 rounded-full bg-[#823BF6]'
                  : 'w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Avaliação ${idx + 1}`}
            />
          ))}
        </div>

        {/* Subtle Side Navigation Arrows */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Próximo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Eye, Shield, Lock, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onDirectScanClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onDirectScanClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(139,92,246,0.14)] bg-[#050507]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-lg py-1 px-1.5"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#0B0B10] border border-[rgba(139,92,246,0.35)] shadow-[0_0_12px_rgba(139,92,246,0.25)] group-hover:border-[#8B5CF6] transition-colors">
            <Eye className="w-4 h-4 text-[#A855F7] group-hover:text-white transition-colors" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#8B5CF6]/20 to-transparent pointer-events-none" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-lg tracking-tight text-[#F8FAFC]">
              Stalkeia<span className="text-[#A855F7]">.app</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono-tech tracking-wider uppercase bg-[#8B5CF6]/10 text-[#C084FC] border border-[#8B5CF6]/20">
              v2.4
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9CA3AF]">
          <a
            href="#como-funciona"
            className="hover:text-[#F8FAFC] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#8B5CF6]"
          >
            Como Funciona
          </a>
          <a
            href="#sigilo"
            className="hover:text-[#F8FAFC] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#8B5CF6]"
          >
            Sigilo & Tecnologia
          </a>
          <a
            href="#recursos"
            className="hover:text-[#F8FAFC] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#8B5CF6]"
          >
            O Que Revelamos
          </a>
          <a
            href="#faq"
            className="hover:text-[#F8FAFC] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#8B5CF6]"
          >
            Dúvidas Frequentes
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onDirectScanClick) {
                onDirectScanClick();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="relative group overflow-hidden px-4 py-2 text-xs font-semibold text-[#F8FAFC] bg-[#0B0B10] border border-[rgba(139,92,246,0.4)] rounded-full hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-200 shadow-[0_0_15px_rgba(139,92,246,0.15)] flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Acessar Sistema</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#9CA3AF] hover:text-[#F8FAFC] focus:outline-none"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[rgba(139,92,246,0.18)] bg-[#0B0B10]/95 backdrop-blur-2xl px-5 py-4 space-y-3">
          <a
            href="#como-funciona"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#9CA3AF] hover:text-[#F8FAFC]"
          >
            Como Funciona
          </a>
          <a
            href="#sigilo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#9CA3AF] hover:text-[#F8FAFC]"
          >
            Sigilo & Tecnologia
          </a>
          <a
            href="#recursos"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#9CA3AF] hover:text-[#F8FAFC]"
          >
            O Que Revelamos
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#9CA3AF] hover:text-[#F8FAFC]"
          >
            Dúvidas Frequentes
          </a>
        </div>
      )}
    </header>
  );
};

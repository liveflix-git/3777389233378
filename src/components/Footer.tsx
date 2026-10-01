import React from 'react';
import { Eye, Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[rgba(139,92,246,0.12)] bg-[#050507] py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0B0B10] border border-[rgba(139,92,246,0.3)]">
            <Eye className="w-4 h-4 text-[#A855F7]" />
          </div>
          <span className="font-display font-bold text-base text-white">
            Stalkeia<span className="text-[#A855F7]">.app</span>
          </span>
          <span className="text-xs text-[#9CA3AF] pl-2 border-l border-neutral-800">
            Inteligência e Investigação Discreta
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9CA3AF]">
          <a href="#como-funciona" className="hover:text-white transition-colors">
            Como Funciona
          </a>
          <a href="#sigilo" className="hover:text-white transition-colors">
            Sigilo & Criptografia
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            Perguntas Frequentes
          </a>
          <a href="#planos" className="hover:text-white transition-colors">
            Planos
          </a>
        </div>

        {/* Legal notice */}
        <div className="text-center md:text-right text-[11px] text-[#6B7280]">
          <p>© 2026 Stalkeia App. Todos os direitos reservados.</p>
          <p className="mt-0.5">Ferramenta independente de inteligência pública.</p>
        </div>

      </div>
    </footer>
  );
};

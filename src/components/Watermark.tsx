import React from 'react';
import { ShieldAlert, Shield } from 'lucide-react';

export const Watermark: React.FC = () => {
  return (
    <footer className="w-full py-3 px-6 text-center border-t border-[#2e271d]/60 bg-[#0c0a08]/80 backdrop-blur-sm mt-auto select-none relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4af37]/60 hover:text-[#d4af37] transition-opacity duration-300">
        <ShieldAlert className="w-3.5 h-3.5 text-[#d4af37]/60" />
        <span className="font-semibold">hosted @Jentle Casper's Empire</span>
      </div>
    </footer>
  );
};

export const ModalWatermark: React.FC = () => {
  return (
    <div className="pt-2.5 mt-4 border-t border-[#2e271d]/60 flex items-center justify-between text-[10px] font-mono text-[#8a7a60]/70 uppercase tracking-wider select-none">
      <span className="flex items-center gap-1.5 text-[#b8a78a]/60">
        <Shield className="w-3 h-3 text-[#d4af37]/60" />
        <span>Calculus Study Suite</span>
      </span>
      <span className="text-[#d4af37]/70 font-semibold tracking-widest">hosted @Jentle Casper's Empire</span>
    </div>
  );
};



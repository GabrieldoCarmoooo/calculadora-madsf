import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-red text-white py-6 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight">Calculadora <span className="text-brand-yellow">MADSF</span></h1>
            <p className="text-xs text-white/80 uppercase tracking-widest font-medium">Madeireira & Marcenaria</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="bg-white/10 px-4 py-1 rounded-full text-sm font-medium border border-white/20">Versão 1.0</span>
        </div>
      </div>
    </header>
  );
};
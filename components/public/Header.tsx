'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  whatsappUrl?: string;
  activeSection?: string;
}

export default function Header({
  activeSection = 'inicio',
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Início', href: '#inicio' },
    { id: 'sobre', label: 'Sobre', href: '#sobre' },
    { id: 'especialidades', label: 'Especialidades', href: '#especialidades' },
    { id: 'portfolio', label: 'Portfólio', href: '#portfolio' },
    { id: 'contato', label: 'Contato', href: '#contato' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#020713] via-[#061836] to-[#020713] backdrop-blur-md border-b border-[rgba(19,200,245,0.22)] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        
        {/* Esquerda: Marca Textual TADEU PERES */}
        <Link
          href="#inicio"
          className="flex flex-col group shrink-0"
        >
          <div className="text-xl sm:text-2xl font-black tracking-tight leading-none">
            <span className="text-[#FFFFFF]">TADEU </span>
            <span className="text-[#13C8F5] drop-shadow-[0_0_8px_rgba(19,200,245,0.45)]">PERES</span>
          </div>
          <span className="text-[9px] sm:text-[10px] tracking-[0.28em] text-[#B8C4D3]/75 font-semibold uppercase mt-1.5">
            DESIGN · WEB · VÍDEO · DEV
          </span>
        </Link>

        {/* Centro: Navegação com indicador Laranja Neon (#FF7900) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative py-2 transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#FF7900] font-semibold'
                    : 'text-[#F5F7FA] hover:text-[#13C8F5]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF7900] rounded-full shadow-[0_0_8px_#FF7900]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Botão de Menu Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#F5F7FA] hover:bg-[#06162B] rounded-lg border border-[rgba(30,150,255,0.3)] transition-colors"
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#13C8F5]" /> : <Menu className="w-6 h-6 text-[#13C8F5]" />}
        </button>
      </div>

      {/* Painel Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#06162B] border-b border-[rgba(30,150,255,0.3)] px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4 text-sm font-medium text-[#F5F7FA]">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-[rgba(30,150,255,0.15)] transition-colors flex items-center justify-between ${
                  activeSection === link.id ? 'text-[#FF7900] font-semibold' : 'hover:text-[#13C8F5]'
                }`}
              >
                <span>{link.label}</span>
                {activeSection === link.id && (
                  <span className="w-2 h-2 rounded-full bg-[#FF7900] shadow-[0_0_6px_#FF7900]" />
                )}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
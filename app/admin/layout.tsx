'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/authContext';
import { LayoutDashboard, FolderKanban, UserCog, ExternalLink, LogOut, ShieldCheck, AlertCircle } from 'lucide-react';

function AdminNav() {
  const pathname = usePathname();
  const { user, isAdmin, isConfigured, signOut } = useAuth();

  // Se estiver na tela de login, não mostra a barra de navegação completa
  if (pathname === '/admin/login') {
    return null;
  }

  const navItems = [
    { label: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
    { label: 'Projetos', href: '/admin/projects', icon: FolderKanban },
    { label: 'Perfil & Contatos', href: '/admin/profile', icon: UserCog },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E5E3DE] shadow-xs">
      {/* Banner de status do backend Supabase */}
      {!isConfigured && (
        <div className="bg-[#202020] text-[#FFFFFF] px-6 py-2 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Modo de Prévia Local Ativo:</strong> Supabase não configurado em .env.local. Alterações são mantidas localmente para testes.
            </span>
          </div>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-300 font-semibold whitespace-nowrap hidden sm:inline"
          >
            Configurar Supabase →
          </a>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#202020]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#202020]" />
            <span>Tadeu Peres · Painel Admin</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#F7F6F2] text-[#202020] border border-[#E5E3DE]'
                      : 'text-[#777777] hover:text-[#202020] hover:bg-[#F7F6F2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#202020] transition-colors"
          >
            <span>Ver Site Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F7F6F2] border border-[#E5E3DE] text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[#202020] font-medium text-[11px]">
                  {user?.email || 'tadeumartinsperes@gmail'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E3DE] bg-[#FFFFFF] hover:bg-[#F7F6F2] text-xs font-semibold text-[#202020] transition-colors cursor-pointer"
                title="Encerrar sessão administrativa"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F7F6F2] text-[#202020] flex flex-col font-sans">
        <AdminNav />
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getAllProjectsAdmin } from '@/lib/portfolioService';
import { Project } from '@/types/portfolio';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  PlusCircle,
  UserCog,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin/login');
      return;
    }

    async function loadStats() {
      try {
        const data = await getAllProjectsAdmin();
        setProjects(data);
      } catch (err) {
        console.error('Erro ao carregar métricas:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin, authLoading, router]);

  if (authLoading || (!isAdmin && loading)) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#202020] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#777777] font-mono">Verificando autorização...</p>
      </div>
    );
  }

  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-10">
      
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202020]">
            Painel Geral
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            Visão consolidada do portfólio de Tadeu Peres
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects?action=new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#202020] hover:bg-black text-[#FFFFFF] text-xs font-semibold transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Projeto</span>
          </Link>
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E3DE] hover:bg-[#F7F6F2] text-[#202020] text-xs font-semibold transition-colors"
          >
            <UserCog className="w-4 h-4" />
            <span>Editar Perfil</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards (Reais) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Projects */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DE] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#777777]">
              Projetos Cadastrados
            </p>
            <p className="text-3xl font-bold text-[#202020] mt-2 font-mono tabular-nums">
              {totalCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F7F6F2] text-[#202020] border border-[#E5E3DE]">
            <FolderKanban className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

        {/* Published Projects */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DE] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#777777]">
              Publicados no Site
            </p>
            <p className="text-3xl font-bold text-emerald-800 mt-2 font-mono tabular-nums">
              {publishedCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

        {/* Drafts */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E3DE] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#777777]">
              Rascunhos Privados
            </p>
            <p className="text-3xl font-bold text-amber-800 mt-2 font-mono tabular-nums">
              {draftCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

      </div>

      {/* Recent Projects Table / Overview */}
      <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E3DE]">
          <div>
            <h2 className="text-base font-bold text-[#202020]">Últimos Projetos</h2>
            <p className="text-xs text-[#777777] mt-0.5">Visão rápida do status de publicação e ordenação</p>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs font-semibold text-[#202020] hover:underline inline-flex items-center gap-1"
          >
            <span>Gerenciar todos ({totalCount})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="divide-y divide-[#E5E3DE]/60">
            {projects.slice(0, 5).map((proj) => (
              <div key={proj.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#202020]">{proj.title}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        proj.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {proj.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <p className="text-xs text-[#777777]">
                    Categoria: {proj.category} · Ordem: {proj.sort_order}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/projects?edit=${proj.id}`}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E3DE] text-xs font-semibold hover:bg-[#F7F6F2] transition-colors"
                  >
                    Editar
                  </Link>
                  {proj.status === 'published' && (
                    <Link
                      href={`/projeto/${proj.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg bg-[#F7F6F2] text-xs font-semibold hover:bg-[#E5E3DE] transition-colors"
                    >
                      Ver no site
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#777777]">
            Nenhum projeto cadastrado no momento.
          </div>
        )}
      </div>

    </div>
  );
}

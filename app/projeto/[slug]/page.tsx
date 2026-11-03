'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Project, ProjectCategory } from '@/types/portfolio';
import { getProjectBySlug } from '@/lib/portfolioService';
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';
import { ArrowLeft, ExternalLink, Calendar, Wrench, CheckCircle, Share2, Layers } from 'lucide-react';

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  design_grafico: 'Design Gráfico',
  webdesign: 'Webdesign',
  audiovisual: 'Audiovisual & Vídeo',
  dev_web: 'Programador Jr.',
};

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjectBySlug(slug, false);
        setProject(data);
      } catch (err) {
        console.error('Erro ao carregar projeto:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020713] flex items-center justify-center p-6 text-[#F5F7FA]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#13C8F5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-[#B8C4D3] font-mono">Carregando detalhes do projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#020713] flex items-center justify-center p-6 text-[#F5F7FA]">
        <div className="max-w-md w-full bg-[#06162B] border border-[rgba(30,150,255,0.3)] rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(8,41,90,0.5)]">
          <div className="w-12 h-12 rounded-xl bg-[#08295A] border border-[rgba(30,150,255,0.4)] flex items-center justify-center mx-auto mb-4 text-[#13C8F5]">
            <Layers className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="text-lg font-bold text-[#F5F7FA] mb-2">Projeto Não Encontrado</h1>
          <p className="text-xs text-[#B8C4D3] leading-relaxed mb-6">
            O projeto solicitado não está disponível ou é um rascunho em edição pelo proprietário.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#020713] bg-[#FF7900] hover:bg-[#ff8c1a] rounded-full transition-all shadow-[0_0_15px_rgba(255,121,0,0.4)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portfólio</span>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[project.category] || project.category;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  };

  const embedUrl = getEmbedVideoUrl(project.video_url);

  return (
    <div className="min-h-screen bg-[#020713] text-[#F5F7FA] flex flex-col">
      {/* Top Bar Navigation back to home */}
      <header className="sticky top-0 z-40 bg-[#020713]/90 backdrop-blur-md border-b border-[rgba(30,150,255,0.25)]">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#B8C4D3] hover:text-[#13C8F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portfólio</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(30,150,255,0.3)] bg-[#06162B] text-xs font-medium text-[#F5F7FA] hover:border-[#13C8F5] transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-[#13C8F5]" />
              <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-16">
        <article className="max-w-4xl mx-auto px-6">
          
          {/* Metadata clean unboxed */}
          <div className="flex items-center gap-2 text-xs text-[#B8C4D3] mb-4 font-mono">
            <span className="font-bold text-[#FF7900] uppercase tracking-wider">{categoryLabel}</span>
            {project.project_year && (
              <>
                <span aria-hidden="true" className="text-[rgba(30,150,255,0.4)]">·</span>
                <span className="flex items-center gap-1 text-[#13C8F5]">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.project_year}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F7FA] mb-6 leading-tight [text-wrap:balance]">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#B8C4D3] leading-relaxed mb-10 max-w-3xl">
            {project.short_description}
          </p>

          {/* Media / Video / Image */}
          <div className="mb-12">
            {embedUrl ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[rgba(30,150,255,0.35)] shadow-[0_0_25px_rgba(8,123,255,0.25)]">
                <iframe
                  src={embedUrl}
                  title={project.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : project.cover_image_path ? (
              <div className="rounded-2xl overflow-hidden border border-[rgba(30,150,255,0.25)] bg-[#06162B] shadow-[0_0_20px_rgba(8,41,90,0.3)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.cover_image_path}
                  alt={project.alt_text || project.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[550px] object-cover"
                />
              </div>
            ) : null}
          </div>

          {/* Project Details Columns */}
          <div className="space-y-8">
            
            {project.context_objective && (
              <section className="p-8 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.25)]">
                <h2 className="text-xs uppercase tracking-wider font-bold text-[#FF7900] mb-4">
                  Contexto & Objetivo
                </h2>
                <p className="text-base text-[#F5F7FA] leading-relaxed whitespace-pre-line">
                  {project.context_objective}
                </p>
              </section>
            )}

            {project.solution_process && (
              <section className="p-8 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.25)]">
                <h2 className="text-xs uppercase tracking-wider font-bold text-[#13C8F5] mb-4">
                  Processo & Solução Adotada
                </h2>
                <p className="text-base text-[#B8C4D3] leading-relaxed whitespace-pre-line">
                  {project.solution_process}
                </p>
              </section>
            )}

            {project.description && (
              <section className="p-8 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.2)]">
                <h2 className="text-xs uppercase tracking-wider font-bold text-[#B8C4D3] mb-4">
                  Detalhamento
                </h2>
                <p className="text-base text-[#B8C4D3]/80 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </section>
            )}

            {/* Tools Used */}
            {project.tools && project.tools.length > 0 && (
              <section className="p-8 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.25)]">
                <h2 className="text-xs uppercase tracking-wider font-bold text-[#FF7900] mb-4 flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Ferramentas & Tecnologias Aplicadas</span>
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {project.tools.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#08295A] border border-[rgba(30,150,255,0.3)] text-xs font-semibold text-[#F5F7FA]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#13C8F5]" />
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* External URL CTA */}
            {project.external_url && (
              <div className="pt-4">
                <a
                  href={project.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FF7900] hover:bg-[#ff8c1a] text-[#020713] text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,121,0,0.4)]"
                >
                  <span>Visitar Projeto Externo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

          </div>

          {/* Bottom Navigation */}
          <div className="mt-16 pt-8 border-t border-[rgba(30,150,255,0.2)] flex items-center justify-between">
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#13C8F5] hover:text-[#FF7900] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retornar a todos os projetos</span>
            </Link>

            <a
              href="https://wa.me/5511981088024"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF7900] hover:underline"
            >
              <span>Solicitar projeto semelhante via WhatsApp →</span>
            </a>
          </div>

        </article>
      </main>

      {/* Clean Bottom Bar */}
      <footer className="py-8 border-t border-[rgba(30,150,255,0.2)] bg-[#020713] text-center text-xs text-[#B8C4D3]/50">
        <p>Tadeu Peres · Portfólio Profissional</p>
      </footer>

      {/* Floating WhatsApp */}
      <FloatingWhatsApp
        phoneNumber="5511981088024"
        displayNumber="55 11 98108-8024"
      />
    </div>
  );
}

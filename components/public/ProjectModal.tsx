'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Project, ProjectCategory } from '@/types/portfolio';
import { X, ExternalLink, Calendar, Wrench, CheckCircle, ArrowRight } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  design_grafico: 'Design Gráfico',
  webdesign: 'Webdesign',
  audiovisual: 'Audiovisual & Criação de Vídeos',
  dev_web: 'Programador Jr.',
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const categoryLabel = CATEGORY_LABELS[project.category] || project.category;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#020713]/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#06162B] text-[#F5F7FA] rounded-2xl border border-[rgba(30,150,255,0.35)] shadow-[0_0_50px_rgba(8,41,90,0.6)] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 sm:px-8 py-5 bg-[#06162B]/95 backdrop-blur-md border-b border-[rgba(30,150,255,0.25)]">
          <div className="flex items-center gap-2 text-xs text-[#B8C4D3] font-mono">
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

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#B8C4D3] hover:text-[#13C8F5] hover:bg-[#08295A] rounded-lg border border-transparent hover:border-[rgba(30,150,255,0.3)] transition-colors"
            aria-label="Fechar janela de detalhes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 md:p-10 space-y-10">
          
          {/* Title & Short Description */}
          <div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#F5F7FA] mb-4">
              {project.title}
            </h2>
            <p className="text-base sm:text-lg text-[#B8C4D3] leading-relaxed">
              {project.short_description}
            </p>
          </div>

          {/* Media / Video / Image */}
          {embedUrl ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[rgba(30,150,255,0.3)] shadow-[0_0_20px_rgba(8,123,255,0.2)]">
              <iframe
                src={embedUrl}
                title={project.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : project.cover_image_path ? (
            <div className="rounded-2xl overflow-hidden border border-[rgba(30,150,255,0.25)] bg-[#020713]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.cover_image_path}
                alt={project.alt_text || project.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          ) : null}

          {/* Contexto e Objetivo */}
          {project.context_objective && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#020713] border border-[rgba(30,150,255,0.2)]">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#FF7900] mb-3">
                Contexto & Objetivo
              </h3>
              <p className="text-sm sm:text-base text-[#F5F7FA] leading-relaxed whitespace-pre-line">
                {project.context_objective}
              </p>
            </div>
          )}

          {/* Processo e Solução Adotada */}
          {project.solution_process && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#020713] border border-[rgba(30,150,255,0.2)]">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#13C8F5] mb-3">
                Processo & Solução Adotada
              </h3>
              <p className="text-sm sm:text-base text-[#B8C4D3] leading-relaxed whitespace-pre-line">
                {project.solution_process}
              </p>
            </div>
          )}

          {/* Descrição Detalhada Adicional */}
          {project.description && (
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#B8C4D3] mb-3">
                Detalhamento do Projeto
              </h3>
              <p className="text-sm sm:text-base text-[#B8C4D3]/80 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {/* Ferramentas e Recursos */}
          {project.tools && project.tools.length > 0 && (
            <div className="border-t border-[rgba(30,150,255,0.2)] pt-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#FF7900] mb-4 flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5" />
                <span>Ferramentas & Tecnologias Utilizadas</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#08295A] border border-[rgba(30,150,255,0.3)] text-xs font-medium text-[#F5F7FA]"
                  >
                    <CheckCircle className="w-3 h-3 text-[#13C8F5]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External URL Link if available */}
          {project.external_url && (
            <div className="pt-2">
              <a
                href={project.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF7900] hover:bg-[#ff8c1a] text-[#020713] text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,121,0,0.4)]"
              >
                <span>Acessar Projeto Externo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>

        {/* Modal Footer with Direct Page Link */}
        <div className="p-6 sm:px-8 bg-[#020713] border-t border-[rgba(30,150,255,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={`/projeto/${project.slug}`}
            className="text-xs font-semibold text-[#13C8F5] hover:text-[#FF7900] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Abrir em página dedicada</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#B8C4D3] hover:text-[#F5F7FA] transition-colors"
          >
            Fechar visualização
          </button>
        </div>
      </div>
    </div>
  );
}

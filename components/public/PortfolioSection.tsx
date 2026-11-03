'use client';

import React, { useState } from 'react';
import { Project, ProjectCategory } from '@/types/portfolio';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { Sparkles, Layers } from 'lucide-react';

interface PortfolioSectionProps {
  projects: Project[];
  activeCategory?: ProjectCategory | 'all';
}

const FILTER_OPTIONS: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos os Projetos' },
  { id: 'design_grafico', label: 'Design Gráfico' },
  { id: 'webdesign', label: 'Webdesign' },
  { id: 'audiovisual', label: 'Audiovisual & Vídeo' },
  { id: 'dev_web', label: 'Programador Jr.' },
];

export default function PortfolioSection({ projects, activeCategory = 'all' }: PortfolioSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<ProjectCategory | 'all'>(activeCategory);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Filtra somente projetos publicados e pela categoria selecionada
  const filteredProjects = projects.filter((p) => {
    if (p.status !== 'published') return false;
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  return (
    <section id="portfolio" className="py-20 md:py-28 border-b border-[rgba(30,150,255,0.2)] bg-[#020713]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#FF7900] font-bold mb-3 drop-shadow-[0_0_8px_rgba(255,121,0,0.4)]">
              02 · Trabalhos Selecionados
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA] [text-wrap:balance]">
              Portfólio de Projetos
            </h2>
          </div>
          <p className="text-sm text-[#B8C4D3] max-w-md leading-relaxed">
            Seleção de trabalhos executados com atenção aos detalhes estéticos e funcionais. Conteúdo gerenciável via painel administrativo.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="mb-12 overflow-x-auto pb-2">
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-[#06162B] border border-[rgba(30,150,255,0.25)] rounded-2xl shadow-[0_0_15px_rgba(8,41,90,0.3)]">
            {FILTER_OPTIONS.map((f) => {
              const isActive = selectedFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#087BFF] text-[#F5F7FA] shadow-[0_0_14px_rgba(8,123,255,0.6)]'
                      : 'text-[#B8C4D3] hover:text-[#13C8F5] hover:bg-[#08295A]/50'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid or Elegant Empty State */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenDetails={(p) => setActiveProject(p)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[rgba(30,150,255,0.3)] bg-[#06162B] p-12 md:p-16 text-center max-w-xl mx-auto shadow-[0_0_20px_rgba(8,41,90,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-[#08295A] border border-[rgba(30,150,255,0.4)] flex items-center justify-center mx-auto mb-4 text-[#13C8F5]">
              <Layers className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F5F7FA] mb-2">
              Nenhum projeto publicado nesta categoria no momento
            </h3>
            <p className="text-xs text-[#B8C4D3] leading-relaxed max-w-md mx-auto mb-6">
              Novos trabalhos estão sendo preparados e serão publicados em breve pelo proprietário.
            </p>
            {selectedFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#020713] bg-[#FF7900] hover:bg-[#ff8c1a] rounded-lg transition-all shadow-[0_0_12px_rgba(255,121,0,0.4)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ver todas as categorias</span>
              </button>
            )}
          </div>
        )}

      </div>

      {/* Lightbox / Details Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}

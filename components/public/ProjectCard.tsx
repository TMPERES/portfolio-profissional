import React from 'react';
import { Project, ProjectCategory } from '@/types/portfolio';
import { ArrowUpRight, Palette, Layout, Film, Code, Calendar } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
}

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  design_grafico: 'Design Gráfico',
  webdesign: 'Webdesign',
  audiovisual: 'Audiovisual & Vídeo',
  dev_web: 'Programador Jr.',
};

function CategoryIcon({ category }: { category: ProjectCategory }) {
  switch (category) {
    case 'design_grafico':
      return <Palette className="w-6 h-6 stroke-[1.5]" />;
    case 'webdesign':
      return <Layout className="w-6 h-6 stroke-[1.5]" />;
    case 'audiovisual':
      return <Film className="w-6 h-6 stroke-[1.5]" />;
    case 'dev_web':
      return <Code className="w-6 h-6 stroke-[1.5]" />;
    default:
      return <Layout className="w-6 h-6 stroke-[1.5]" />;
  }
}

export default function ProjectCard({ project, onOpenDetails }: ProjectCardProps) {
  const categoryLabel = CATEGORY_LABELS[project.category] || project.category;

  return (
    <article
      onClick={() => onOpenDetails(project)}
      className="group cursor-pointer rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.25)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#13C8F5] hover:shadow-[0_0_25px_rgba(19,200,245,0.2)]"
    >
      <div>
        {/* Visual Cover / Styled CSS Graphic Fallback Container */}
        <div className="relative aspect-4/3 w-full bg-[#020713] border-b border-[rgba(30,150,255,0.2)] overflow-hidden flex items-center justify-center p-6">
          {project.cover_image_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover_image_path}
              alt={project.alt_text || project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            // Elegant Architectural Fallback
            <div className="w-full h-full rounded-xl border border-dashed border-[rgba(30,150,255,0.3)] flex flex-col items-center justify-center text-center p-6 bg-[#06162B]/60">
              <div className="w-12 h-12 rounded-xl bg-[#08295A] text-[#FF7900] border border-[#FF7900]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(255,121,0,0.25)]">
                <CategoryIcon category={project.category} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#13C8F5]">
                {categoryLabel}
              </span>
              <span className="text-xs text-[#B8C4D3]/60 mt-1 font-mono">
                {project.project_year ? `Edição · ${project.project_year}` : 'Projeto Selecionado'}
              </span>
            </div>
          )}

          {/* Hover Overlay Affordance */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#020713]/80 backdrop-blur-xs border border-[#13C8F5] flex items-center justify-center text-[#13C8F5] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_12px_rgba(19,200,245,0.4)]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          {/* Metadata clean unboxed text */}
          <div className="flex items-center gap-2 text-xs text-[#B8C4D3] mb-3 font-mono">
            <span className="font-semibold text-[#FF7900]">{categoryLabel}</span>
            {project.project_year && (
              <>
                <span aria-hidden="true" className="text-[rgba(30,150,255,0.4)]">·</span>
                <span className="inline-flex items-center gap-1 text-[#B8C4D3]/70">
                  <Calendar className="w-3 h-3 text-[#13C8F5]" />
                  {project.project_year}
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg md:text-xl font-bold text-[#F5F7FA] tracking-tight group-hover:text-[#13C8F5] transition-colors leading-snug mb-3">
            {project.title}
          </h3>

          <p className="text-sm text-[#B8C4D3] leading-relaxed line-clamp-3">
            {project.short_description}
          </p>
        </div>
      </div>

      {/* Card Footer: Tools & Detail Action */}
      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
        {project.tools && project.tools.length > 0 && (
          <div className="pt-4 border-t border-[rgba(30,150,255,0.15)] flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#B8C4D3]/75">
            <span className="font-semibold text-[#13C8F5]">Ferramentas:</span>
            <span>{project.tools.slice(0, 3).join(', ')}{project.tools.length > 3 ? '...' : ''}</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#13C8F5] group-hover:text-[#FF7900] transition-colors">
          <span>Ver detalhes do projeto</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
}

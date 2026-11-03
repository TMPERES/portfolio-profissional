import React from 'react';
import { Skill } from '@/types/portfolio';
import { CheckCircle } from 'lucide-react';

interface ToolsSectionProps {
  skills: Skill[];
}

export default function ToolsSection({ skills }: ToolsSectionProps) {
  const visibleSkills = skills.filter((s) => s.is_visible);

  return (
    <section className="py-20 md:py-24 border-b border-[rgba(30,150,255,0.2)] bg-[#020713]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#FF7900] font-bold mb-3 drop-shadow-[0_0_8px_rgba(255,121,0,0.4)]">
              03 · Stack Técnica & Softwares
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA] [text-wrap:balance]">
              Ferramentas & Tecnologias
            </h2>
          </div>
          <p className="text-sm text-[#B8C4D3] max-w-md leading-relaxed">
            Ferramentas utilizadas ativamente em fluxos de trabalho de criação gráfica, edição de vídeo e desenvolvimento web.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-6 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.25)] flex flex-col justify-between transition-all hover:border-[#13C8F5] shadow-[0_0_15px_rgba(8,41,90,0.2)] group"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF7900] shadow-[0_0_8px_#FF7900]" />
                  <h3 className="text-base font-bold text-[#F5F7FA] group-hover:text-[#13C8F5] transition-colors tracking-tight">
                    {skill.name}
                  </h3>
                </div>
                {skill.description && (
                  <p className="text-xs text-[#B8C4D3]/80 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(30,150,255,0.15)] flex items-center gap-1.5 text-xs text-[#B8C4D3]/70">
                <CheckCircle className="w-3.5 h-3.5 text-[#13C8F5]" />
                <span>Uso prático em projetos</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

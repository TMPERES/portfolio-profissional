import React from 'react';
import { Palette, Layout, Film, Code, CheckCircle, Sparkles } from 'lucide-react';
import { ProjectCategory } from '@/types/portfolio';

interface SpecialtiesProps {
  onSelectCategory?: (category: ProjectCategory) => void;
}

export default function Specialties({ onSelectCategory }: SpecialtiesProps) {
  const specialties = [
    {
      id: 'design_grafico' as ProjectCategory,
      title: 'Design Gráfico',
      level: 'Competência consolidada',
      icon: Palette,
      description: 'Criação de identidades visuais completas, marcas, papelaria institucional, materiais editoriais e peças gráficas para ambientes físicos e digitais.',
      deliverables: ['Identidade visual & logo', 'Diagramação editorial', 'Peças para redes sociais', 'Vetorização e mockups'],
    },
    {
      id: 'webdesign' as ProjectCategory,
      title: 'Webdesign',
      level: 'Competência consolidada',
      icon: Layout,
      description: 'Planejamento e concepção de layouts limpos, modernos e funcionais. Foco em hierarquia de informação, tipografia legível e experiência do usuário fluida.',
      deliverables: ['Design de landing pages', 'Arquitetura de informação', 'Sistemas de cores e fontes', 'Layouts mobile-first'],
    },
    {
      id: 'audiovisual' as ProjectCategory,
      title: 'Criação & Edição de Vídeos',
      level: 'Competência consolidada',
      icon: Film,
      description: 'Edição audiovisual com cortes precisos, tratamento de áudio, ritmo dinâmico e legendagem estilizada para redes sociais e apresentações institucionais.',
      deliverables: ['Edição de Reels e TikTok', 'Vídeos institucionais', 'Tratamento de áudio & cor', 'Motion graphics básico'],
    },
    {
      id: 'dev_web' as ProjectCategory,
      title: 'Desenvolvimento Web Júnior',
      level: 'Conhecimento em desenvolvimento contínuo',
      icon: Code,
      description: 'Construção de interfaces modernas com HTML5, CSS3, JavaScript, TypeScript e React. Aplicação de boas práticas de estruturação de código e responsividade.',
      deliverables: ['Desenvolvimento com React', 'Integração de APIs', 'Código limpo & tipado', 'Componentização reutilizável'],
    },
  ];

  return (
    <section id="especialidades" className="py-20 md:py-28 border-b border-[rgba(30,150,255,0.2)] bg-[#020713]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#FF7900] font-bold mb-3 drop-shadow-[0_0_8px_rgba(255,121,0,0.4)]">
              02 · Disciplinas de Atuação
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA] [text-wrap:balance]">
              Especialidades & Competências
            </h2>
          </div>
          <p className="text-sm text-[#B8C4D3] max-w-md leading-relaxed">
            União de sensibilidade estética e habilidades técnicas para atender demandas de comunicação visual e presença na web.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {specialties.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.25)] p-8 md:p-10 flex flex-col justify-between transition-all hover:border-[#13C8F5] group shadow-[0_0_20px_rgba(8,41,90,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-[#08295A] border border-[rgba(255,121,0,0.4)] text-[#FF7900] shadow-[0_0_12px_rgba(255,121,0,0.3)] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-mono text-[#B8C4D3]/60">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#F5F7FA] tracking-tight mb-2 group-hover:text-[#13C8F5] transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#13C8F5] mb-5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
                    <span>{item.level}</span>
                  </div>

                  <p className="text-sm text-[#B8C4D3] leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="border-t border-[rgba(30,150,255,0.2)] pt-5">
                    <p className="text-xs font-semibold text-[#FF7900] uppercase tracking-wider mb-3">
                      Entregáveis comuns:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#B8C4D3]">
                      {item.deliverables.map((d) => (
                        <li key={d} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#13C8F5] shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {onSelectCategory && (
                    <div className="mt-6 pt-4 border-t border-[rgba(30,150,255,0.2)]">
                      <button
                        type="button"
                        onClick={() => onSelectCategory(item.id)}
                        className="text-xs font-semibold text-[#13C8F5] hover:text-[#FF7900] hover:underline inline-flex items-center gap-1 transition-colors"
                      >
                        Ver projetos nesta área →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

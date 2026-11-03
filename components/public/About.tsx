import React from 'react';
import { Profile } from '@/types/portfolio';
import { FileText, Sparkles } from 'lucide-react';

interface AboutProps {
  profile: Profile;
}

export default function About({ profile }: AboutProps) {
  return (
    <section id="sobre" className="py-20 md:py-28 border-b border-[rgba(30,150,255,0.2)] bg-[#020713]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-10 text-left">
          <p className="text-xs uppercase tracking-widest text-[#FF7900] font-bold mb-3 drop-shadow-[0_0_8px_rgba(255,121,0,0.4)]">
            01 · Trajetória & Perfil
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA] [text-wrap:balance]">
            Sobre Tadeu Peres
          </h2>
        </div>

        {/* Texto Restante Alinhado e Ajustado no Lado Esquerdo */}
        <div className="max-w-4xl mr-auto text-left flex flex-col gap-10">
          
          {/* Apresentação Profissional */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#FF7900] font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>Apresentação Profissional</span>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-[#F5F7FA]/90 leading-relaxed font-normal whitespace-pre-line">
              {profile.bio || 'Profissional multidisciplinar com atuação em design gráfico, webdesign, edição audiovisual e desenvolvimento web em nível júnior. Trabalho com foco em clareza, estética contemporânea e execução técnica cuidadosa.'}
            </p>
          </div>

          {/* Abordagem de Trabalho */}
          {profile.approach && (
            <div className="p-7 sm:p-8 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.25)] shadow-[0_0_20px_rgba(8,41,90,0.25)]">
              <h4 className="text-xs uppercase tracking-wider text-[#13C8F5] font-bold mb-3">
                Abordagem de Trabalho
              </h4>
              <p className="text-sm sm:text-base text-[#B8C4D3] leading-relaxed">
                {profile.approach}
              </p>
            </div>
          )}

          {/* Cartões de Visão e Evolução Técnica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.2)] hover:border-[#13C8F5]/40 transition-colors">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF7900]">Visão Criativa</span>
              <p className="text-sm text-[#B8C4D3] mt-2.5 leading-relaxed">
                Tratar o design e a tecnologia como ferramentas complementares de comunicação e solução de problemas reais.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.2)] hover:border-[#13C8F5]/40 transition-colors">
              <span className="text-xs font-bold uppercase tracking-wider text-[#13C8F5]">Evolução Técnica</span>
              <p className="text-sm text-[#B8C4D3] mt-2.5 leading-relaxed">
                Aperfeiçoamento contínuo em boas práticas de desenvolvimento web moderno e produção audiovisual.
              </p>
            </div>
          </div>

          {/* Currículo se disponível */}
          {profile.resume_url && (
            <div className="pt-2">
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 py-3 px-6 text-xs font-semibold text-[#F5F7FA] bg-[#08295A]/80 hover:bg-[#08295A] border border-[rgba(30,150,255,0.4)] hover:border-[#13C8F5] rounded-xl transition-all shadow-[0_0_15px_rgba(19,200,245,0.15)]"
              >
                <FileText className="w-4 h-4 text-[#FF7900]" />
                <span>Visualizar Currículo (PDF)</span>
              </a>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

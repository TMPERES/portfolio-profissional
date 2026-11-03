import React from 'react';
import Link from 'next/link';

interface FooterProps {
  fullName?: string;
  professionalTitle?: string;
  whatsappUrl?: string;
}

export default function Footer({ 
  professionalTitle,
  whatsappUrl = 'https://wa.me/5511981088024'
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contato" className="bg-[#020713] text-[#F5F7FA] py-16 border-t border-[rgba(30,150,255,0.2)]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[rgba(30,150,255,0.15)]">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-6">
            <Link href="#inicio" className="text-xl sm:text-2xl font-black tracking-tight inline-block">
              <span className="text-[#F5F7FA]">TADEU </span>
              <span className="text-[#13C8F5] drop-shadow-[0_0_8px_rgba(19,200,245,0.4)]">PERES</span>
            </Link>
            <p className="text-xs sm:text-sm text-[#13C8F5]/80 max-w-sm mt-2 font-mono tracking-wider">
              {professionalTitle || 'DESIGN · WEB · VÍDEO · DEV'}
            </p>
            <p className="text-xs text-[#B8C4D3]/70 mt-4 leading-relaxed italic max-w-md">
              &quot;Transformo ideias em experiências visuais e digitais, unindo design, comunicação e tecnologia.&quot;
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#FF7900] mb-4 drop-shadow-[0_0_6px_rgba(255,121,0,0.4)]">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8C4D3]">
              <li>
                <Link href="#inicio" className="hover:text-[#13C8F5] transition-colors">Início</Link>
              </li>
              <li>
                <Link href="#sobre" className="hover:text-[#13C8F5] transition-colors">Sobre</Link>
              </li>
              <li>
                <Link href="#portfolio" className="hover:text-[#13C8F5] transition-colors">Portfólio</Link>
              </li>
              <li>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#25D366] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                  <span>Contato</span>
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp no Rodapé da Página */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#25D366] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
              <span>WhatsApp</span>
            </h4>
            <p className="text-xs text-[#B8C4D3]/75 mb-3 leading-relaxed">
              Disponível para novos projetos, orçamentos e parcerias.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Conversar no WhatsApp: +55 (11) 98108-8024"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#06162B] hover:bg-[#08295A] border border-[#25D366]/60 hover:border-[#25D366] text-xs font-semibold text-[#F5F7FA] transition-all shadow-[0_0_12px_rgba(37,211,102,0.2)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] group"
            >
              <div className="w-5 h-5 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.586 1.771.867 2.796.867 3.181 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.754-5.767-5.754zm3.385 8.167c-.145.407-.723.774-1.026.822-.297.047-.686.082-2.158-.498-1.748-.689-2.87-2.459-2.956-2.574-.087-.116-.711-.947-.711-1.808 0-.861.448-1.284.608-1.458.16-.174.348-.217.464-.217.116 0 .232.001.333.007.106.006.249-.04.389.297.145.348.493 1.204.536 1.291.043.087.072.189.014.304-.058.116-.087.189-.174.29-.087.101-.184.226-.263.304-.087.087-.179.182-.077.356.102.174.453.748.972 1.211.669.596 1.233.78 1.407.867.174.087.276.073.378-.044.102-.116.435-.508.551-.682.116-.174.232-.145.391-.087.16.058 1.015.479 1.189.566.174.087.29.131.333.203.044.073.044.421-.101.828z" />
                </svg>
              </div>
              <span className="font-mono text-xs">+55 (11) 98108-8024</span>
            </a>
          </div>

        </div>

        {/* Bottom Credits & Copyright com Painel Administrativo Oculto */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8C4D3]/50">
          <Link
            href="/admin"
            className="hover:text-[#13C8F5] transition-colors cursor-pointer select-none"
            title="Área Administrativa"
          >
            © {currentYear} Tadeu Peres. Todos os direitos reservados.
          </Link>
        </div>

      </div>
    </footer>
  );
}

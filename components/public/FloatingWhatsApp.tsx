'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  displayNumber?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = '5511981088024',
  displayNumber = '55 11 98108-8024',
}: FloatingWhatsAppProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <aside
      aria-label="Contato direto via WhatsApp"
      className="fixed bottom-6 right-6 z-50 transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3.5 px-4 py-2.5 rounded-full bg-[#06162B]/95 hover:bg-[#08295A] border border-[#13C8F5] text-[#F5F7FA] shadow-[0_0_20px_rgba(19,200,245,0.35)] hover:shadow-[0_0_30px_rgba(19,200,245,0.6)] backdrop-blur-md transition-all group"
      >
        {/* WhatsApp Icon with Emerald/Cyan Neon Glow */}
        <div className="w-9 h-9 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center text-[#25D366] shadow-[0_0_10px_rgba(37,211,102,0.4)] group-hover:shadow-[0_0_16px_rgba(37,211,102,0.7)] transition-all shrink-0">
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.586 1.771.867 2.796.867 3.181 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.754-5.767-5.754zm3.385 8.167c-.145.407-.723.774-1.026.822-.297.047-.686.082-2.158-.498-1.748-.689-2.87-2.459-2.956-2.574-.087-.116-.711-.947-.711-1.808 0-.861.448-1.284.608-1.458.16-.174.348-.217.464-.217.116 0 .232.001.333.007.106.006.249-.04.389.297.145.348.493 1.204.536 1.291.043.087.072.189.014.304-.058.116-.087.189-.174.29-.087.101-.184.226-.263.304-.087.087-.179.182-.077.356.102.174.453.748.972 1.211.669.596 1.233.78 1.407.867.174.087.276.073.378-.044.102-.116.435-.508.551-.682.116-.174.232-.145.391-.087.16.058 1.015.479 1.189.566.174.087.29.131.333.203.044.073.044.421-.101.828z" />
          </svg>
        </div>

        {/* Text Container */}
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xs font-bold text-[#F5F7FA] tracking-wide">
            WhatsApp
          </span>
          <span className="text-[11px] text-[#B8C4D3] font-mono tracking-tight mt-0.5">
            {displayNumber}
          </span>
        </div>

        {/* Chevron > */}
        <ChevronRight className="w-4 h-4 text-[#13C8F5] group-hover:translate-x-0.5 transition-transform shrink-0" />
      </a>
    </aside>
  );
}

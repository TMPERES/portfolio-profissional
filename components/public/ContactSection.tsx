import React from 'react';
import { ContactLink } from '@/types/portfolio';
import { MessageSquare, Mail, Linkedin, Github, Globe, ArrowUpRight } from 'lucide-react';

interface ContactSectionProps {
  contacts: ContactLink[];
}

function getContactIcon(type: string) {
  switch (type) {
    case 'whatsapp': return MessageSquare;
    case 'email': return Mail;
    case 'linkedin': return Linkedin;
    case 'github': return Github;
    default: return Globe;
  }
}

export default function ContactSection({ contacts }: ContactSectionProps) {
  const activeContacts = contacts.filter((c) => c.is_active);

  // Formatação segura de link do WhatsApp
  const formatContactUrl = (contact: ContactLink) => {
    if (contact.contact_type === 'whatsapp') {
      const raw = contact.value_url.replace(/\D/g, '');
      const cleanPhone = (!raw || raw === '551198108024') ? '5511981088024' : raw;
      const encodedMsg = contact.whatsapp_message 
        ? encodeURIComponent(contact.whatsapp_message)
        : encodeURIComponent('Olá, Tadeu! Vi seu portfólio e gostaria de conversar sobre um projeto.');
      return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    }
    if (contact.contact_type === 'email' && !contact.value_url.startsWith('mailto:')) {
      return `mailto:${contact.value_url}`;
    }
    return contact.value_url;
  };

  return (
    <section id="contato" className="py-20 md:py-28 border-b border-[rgba(30,150,255,0.2)] bg-[#020713]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-[#FF7900] font-bold mb-3 drop-shadow-[0_0_8px_rgba(255,121,0,0.4)]">
            04 · Conexão & Propostas
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F7FA] mb-6 [text-wrap:balance]">
            Vamos conversar sobre o seu próximo projeto?
          </h2>
          <p className="text-base sm:text-lg text-[#B8C4D3] leading-relaxed">
            Seja para demandas de design gráfico, criação de websites modernos, edição de vídeos comerciais ou oportunidades profissionais, entre em contato direto pelos canais abaixo.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeContacts.map((contact) => {
            const Icon = getContactIcon(contact.contact_type);
            const destinationUrl = formatContactUrl(contact);
            const isWhatsapp = contact.contact_type === 'whatsapp';

            return (
              <a
                key={contact.id}
                href={destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                  isWhatsapp
                    ? 'bg-[#06162B] text-[#F5F7FA] border-[#13C8F5] shadow-[0_0_20px_rgba(19,200,245,0.25)] hover:shadow-[0_0_30px_rgba(19,200,245,0.45)]'
                    : 'bg-[#06162B] text-[#F5F7FA] border-[rgba(30,150,255,0.25)] hover:border-[#13C8F5] shadow-[0_0_15px_rgba(8,41,90,0.2)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className={`p-3 rounded-xl ${
                        isWhatsapp
                          ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                          : 'bg-[#08295A] text-[#13C8F5] border border-[#13C8F5]/30'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${
                        isWhatsapp ? 'text-[#25D366]' : 'text-[#13C8F5]'
                      }`}
                    />
                  </div>

                  <h3 className="text-base font-bold tracking-tight mb-1 text-[#F5F7FA]">
                    {contact.label}
                  </h3>

                  <p className="text-xs text-[#B8C4D3]/70 truncate font-mono">
                    {contact.contact_type === 'whatsapp' 
                      ? '+55 (11) 98108-8024'
                      : contact.value_url.replace(/^mailto:/, '').replace(/^https?:\/\//, '')}
                  </p>
                </div>

                <div
                  className={`mt-8 pt-4 border-t text-xs font-semibold ${
                    isWhatsapp
                      ? 'border-[#13C8F5]/30 text-[#13C8F5]'
                      : 'border-[rgba(30,150,255,0.15)] text-[#B8C4D3] group-hover:text-[#13C8F5]'
                  }`}
                >
                  <span>{isWhatsapp ? 'Conversar no WhatsApp →' : 'Acessar canal →'}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Professional Note */}
        <div className="mt-12 p-6 rounded-2xl bg-[#06162B] border border-[rgba(30,150,255,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              Disponibilidade Atual
            </p>
            <p className="text-xs text-[#B8C4D3] mt-0.5">
              Aberto a projetos de freelance, contratos de criação contínua e oportunidades para desenvolvedor web júnior / webdesigner.
            </p>
          </div>
          <span className="text-xs font-mono text-[#13C8F5] shrink-0">
            Tempo de resposta médio: 24h
          </span>
        </div>

      </div>
    </section>
  );
}

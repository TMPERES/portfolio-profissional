'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Specialties from '@/components/public/Specialties';
import PortfolioSection from '@/components/public/PortfolioSection';
import ToolsSection from '@/components/public/ToolsSection';
import Footer from '@/components/public/Footer';
import { Project, Profile, ContactLink, Skill, ProjectCategory } from '@/types/portfolio';
import {
  getPublishedProjects,
  getProfile,
  getContactLinks,
  getSkills,
} from '@/lib/portfolioService';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_CONTACTS,
  INITIAL_SKILLS,
} from '@/lib/constants';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [contacts, setContacts] = useState<ContactLink[]>(INITIAL_CONTACTS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [activeSection, setActiveSection] = useState<string>('inicio');

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, projData, contData, skillData] = await Promise.all([
          getProfile(),
          getPublishedProjects(),
          getContactLinks(),
          getSkills(),
        ]);
        setProfile(profData);
        setProjects(projData);
        setContacts(contData);
        setSkills(skillData);
      } catch (err) {
        console.error('Erro ao carregar dados do portfólio:', err);
      }
    }
    loadData();

    // Atualiza seção ativa no menu conforme rolagem (Início, Sobre, Especialidades, Portfólio, Contato)
    const sections = ['inicio', 'sobre', 'especialidades', 'portfolio', 'contato'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const sectionId of sections) {
        const elem = document.getElementById(sectionId);
        if (elem) {
          const top = elem.offsetTop;
          const height = elem.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappContact = contacts.find((c) => c.contact_type === 'whatsapp' && c.is_active);
  const rawUrl = whatsappContact?.value_url;
  const whatsappUrl = (rawUrl && !rawUrl.includes('551198108024'))
    ? rawUrl
    : 'https://wa.me/5511981088024';

  const handleSelectSpecialtyCategory = (category: string) => {
    setSelectedCategory(category as ProjectCategory);
    const portfolioElem = document.getElementById('portfolio');
    if (portfolioElem) {
      portfolioElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#F5F7FA]">
      {/* Topo idêntico à Imagem 2 */}
      <Header
        whatsappUrl={whatsappUrl}
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* Hero Section com Constelação Expandida em Todo o Bloco */}
        <Hero
          whatsappUrl={whatsappUrl}
          onSelectCategory={handleSelectSpecialtyCategory}
        />

        {/* 01 · Trajetória & Perfil */}
        <About profile={profile} />

        {/* 02 · Especialidades & Competências (Alvo do link "Especialidades" do menu) */}
        <Specialties onSelectCategory={handleSelectSpecialtyCategory} />

        {/* Portfólio com filtros e modal de detalhes */}
        <PortfolioSection
          projects={projects}
          activeCategory={selectedCategory}
        />

        {/* Ferramentas e Tecnologias */}
        <ToolsSection skills={skills} />
      </main>

      {/* Rodapé Cinematográfico com WhatsApp e Painel Oculto */}
      <Footer
        fullName={profile.full_name}
        professionalTitle={profile.professional_title}
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}

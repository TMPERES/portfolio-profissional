-- ==============================================================================
-- SCHEMA & MIGRATION: Tadeu Peres Portfolio
-- Database: Supabase (PostgreSQL 15+)
-- Date: 2026-10-19
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE project_category AS ENUM (
        'design_grafico',
        'webdesign',
        'audiovisual',
        'dev_web'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM (
        'draft',
        'published'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. TABLE: profile (Perfil institucional do profissional)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT 'Tadeu Peres',
    professional_title TEXT NOT NULL DEFAULT 'Design Gráfico, Webdesign, Audiovisual & Dev Júnior',
    hero_title TEXT NOT NULL DEFAULT 'Ideias que ganham forma. Projetos que ganham vida.',
    hero_subtitle TEXT NOT NULL DEFAULT 'Design gráfico, experiências web e conteúdo audiovisual para transformar ideias em soluções visuais e digitais.',
    bio TEXT NOT NULL DEFAULT 'Profissional multidisciplinar focado em soluções visuais e digitais de alto impacto. Atua combinando sensibilidade estética, comunicação clara e código limpo para construir marcas, interfaces e conteúdos audiovisuais envolventes.',
    approach TEXT DEFAULT 'Cada projeto parte da compreensão profunda do objetivo: simplificar o complexo, valorizar a identidade visual e entregar funcionalidade sólida sem excessos desnecessários.',
    avatar_url TEXT,
    resume_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserção de registro único garantido
INSERT INTO public.profile (id, full_name, professional_title, hero_title, hero_subtitle, bio, approach)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Tadeu Peres',
    'Design Gráfico · Webdesign · Criação e Edição de Vídeos · Desenvolvimento Web Jr.',
    'Ideias que ganham forma. Projetos que ganham vida.',
    'Design gráfico, experiências web e conteúdo audiovisual para transformar ideias em soluções visuais e digitais.',
    'Profissional multidisciplinar com atuação em design gráfico, webdesign, edição audiovisual e desenvolvimento web em nível júnior. Trabalho com foco em clareza, estética contemporânea e execução técnica cuidadosa.',
    'Abordagem orientada à resolução prática de problemas visuais e de comunicação digital, respeitando a identidade de cada marca e as necessidades reais de cada cliente.'
) ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. TABLE: projects (Projetos do Portfólio)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('design_grafico', 'webdesign', 'audiovisual', 'dev_web')),
    short_description TEXT NOT NULL,
    description TEXT,
    context_objective TEXT,
    solution_process TEXT,
    cover_image_path TEXT,
    alt_text TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_url TEXT,
    external_url TEXT,
    tools TEXT[] DEFAULT ARRAY[]::TEXT[],
    project_year INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

-- ------------------------------------------------------------------------------
-- 4. TABLE: contact_links (Links de Contato e Redes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_type TEXT NOT NULL CHECK (contact_type IN ('whatsapp', 'email', 'linkedin', 'github', 'other')),
    label TEXT NOT NULL,
    value_url TEXT NOT NULL,
    whatsapp_message TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_links_order ON public.contact_links(sort_order ASC);

-- ------------------------------------------------------------------------------
-- 5. TABLE: skills (Ferramentas e Especialidades)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('design_grafico', 'webdesign', 'audiovisual', 'dev_web', 'outros')),
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed de ferramentas reais mencionadas no documento (CorelDRAW, Photoshop, Filmora, CapCut, HTML/CSS, JS/TS, React)
INSERT INTO public.skills (name, category, description, sort_order, is_visible)
VALUES
    ('Adobe Photoshop', 'design_grafico', 'Edição, tratamento de imagem e composições visuais.', 1, true),
    ('CorelDRAW', 'design_grafico', 'Vetorização, layouts gráficos e preparação de arquivos.', 2, true),
    ('Webdesign & UI', 'webdesign', 'Concepção de interfaces digitais minimalistas e funcionais.', 3, true),
    ('Filmora', 'audiovisual', 'Corte, montagem e edição dinâmica de vídeos.', 4, true),
    ('CapCut', 'audiovisual', 'Edição ágil, formatos verticais e ritmo audiovisual.', 5, true),
    ('HTML5 & CSS3', 'dev_web', 'Estruturação semântica, responsividade e estilização moderna.', 6, true),
    ('JavaScript & TypeScript', 'dev_web', 'Lógica de programação, tipagem e manipulação do DOM.', 7, true),
    ('React', 'dev_web', 'Criação de componentes reativos e interfaces web.', 8, true)
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Regras para 'profile'
-- Qualquer visitante anônimo pode ler o perfil público
CREATE POLICY "Public profile read"
    ON public.profile FOR SELECT
    USING (true);

-- Apenas usuários autenticados (Admin) podem atualizar o perfil
CREATE POLICY "Admin profile update"
    ON public.profile FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Regras para 'projects'
-- Visitantes anônimos podem ler APENAS projetos com status = 'published'
CREATE POLICY "Public can view published projects only"
    ON public.projects FOR SELECT
    USING (status = 'published');

-- Usuários autenticados podem ver todos os projetos (incluindo rascunhos)
CREATE POLICY "Authenticated users view all projects"
    ON public.projects FOR SELECT
    TO authenticated
    USING (true);

-- Apenas autenticados podem inserir novos projetos
CREATE POLICY "Authenticated users can insert projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Apenas autenticados podem editar projetos
CREATE POLICY "Authenticated users can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Apenas autenticados podem deletar projetos
CREATE POLICY "Authenticated users can delete projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (true);

-- Regras para 'contact_links'
CREATE POLICY "Public can view active contacts"
    ON public.contact_links FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admin manage contacts"
    ON public.contact_links FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Regras para 'skills'
CREATE POLICY "Public can view visible skills"
    ON public.skills FOR SELECT
    USING (is_visible = true);

CREATE POLICY "Admin manage skills"
    ON public.skills FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. STORAGE BUCKET CONFIGURATION (portfolio-media)
-- ------------------------------------------------------------------------------
-- O bucket 'portfolio-media' deve ser criado no painel Supabase Storage como público para leitura.
-- Políticas de Storage recomendadas:
-- Leitura pública:
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
-- Upload autenticado:
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-media');
-- Delete autenticado:
-- CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-media');

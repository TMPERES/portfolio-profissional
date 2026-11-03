# Tadeu Peres — Portfólio Profissional & Painel Administrativo

Aplicação web completa, minimalista e editorial desenvolvida para **Tadeu Martins Peres**, reunindo suas quatro frentes de atuação:
1. **Design Gráfico**
2. **Webdesign**
3. **Criação e Edição de Vídeos**
4. **Desenvolvimento Web Júnior**

O sistema possui área pública de alta fidelidade visual e um **painel administrativo protegido (`/admin`)** para cadastro, edição, publicação e gerenciamento de projetos, perfil institucional, ferramentas e canais de contato.

---

## 1. Stack Tecnológica

- **Frontend & Full-Stack:** React 19, Next.js 15+ (App Router), TypeScript em modo estrito.
- **Estilização & Design Tokens:** Tailwind CSS v4 com paleta minimalista editorial (`#F7F6F2`, `#202020`, `#E5E3DE`).
- **Ícones:** Lucide React.
- **Backend & Banco de Dados:** PostgreSQL com Row Level Security (RLS) via Supabase (com fallback local resiliente para testes sem credenciais).
- **Autenticação:** Supabase Auth (e-mail e senha com sessão persistente e recuperação segura).
- **Armazenamento de Mídia:** Supabase Storage (bucket `portfolio-media` com validação de tipo e limite de 5MB).
- **SEO & Indexação:** Metadados dinâmicos, OpenGraph, Twitter Cards, `robots.txt` e `sitemap.xml` automáticos.

---

## 2. Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado.
- Gerenciador de pacotes `npm` ou `pnpm`.

### Instalação e Execução
```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento local
npm run dev

# 3. Acessar a aplicação no navegador
# Site público: http://localhost:3000
# Painel admin: http://localhost:3000/admin
```

---

## 3. Configuração do Supabase (Banco de Dados, RLS e Auth)

O projeto pode ser conectado a qualquer projeto gratuito do Supabase (https://supabase.com).

### Passo 1: Criar o Projeto no Supabase
1. Acesse https://supabase.com e crie uma conta gratuita.
2. Crie uma nova organização e um novo projeto (ex: `tadeu-peres-portfolio`).

### Passo 2: Executar a Migration SQL
1. No painel do seu projeto Supabase, acesse **SQL Editor**.
2. Abra o arquivo local `supabase/migrations/20261019_init_schema.sql`.
3. Cole o conteúdo no SQL Editor do Supabase e clique em **Run**.
4. Este script cria automaticamente:
   - Tabelas: `profile`, `projects`, `contact_links`, `skills`.
   - Índices de performance por status, categoria, slug e ordem.
   - Enums para categorias e status.
   - Políticas RLS restritas (leitura pública apenas para projetos publicados; escrita apenas para autenticados).
   - Dados iniciais do perfil institucional e ferramentas de Tadeu Peres.

### Passo 3: Configurar o Bucket de Mídia (Storage)
1. No painel Supabase, vá em **Storage** > **New Bucket**.
2. Nomeie o bucket como: `portfolio-media`.
3. Marque a opção **Public bucket** (para que as imagens de projetos publicados sejam acessíveis publicamente).
4. Em **Policies**, adicione a política de INSERT e DELETE para usuários autenticados (`authenticated`).

### Passo 4: Criar o Primeiro Administrador
1. No painel Supabase, acesse **Authentication** > **Users**.
2. Clique em **Add user** > **Create user**.
3. Preencha o e-mail do Tadeu (ex: `admin@tadeuperes.com.br`) e defina uma senha forte.
4. Confirme a criação do usuário. Pronto! Esse usuário agora pode fazer login em `/admin/login`.

### Passo 5: Configurar as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com as credenciais obtidas em **Project Settings > API**:
```env
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon-publica"
```

---

## 4. Estrutura do Projeto

```
├── app/
│   ├── globals.css              # Variáveis de design e paleta minimalista
│   ├── layout.tsx               # Metadados raiz, SEO técnico e idioma pt-BR
│   ├── page.tsx                 # Página inicial pública com todas as seções
│   ├── robots.ts                # Geração dinâmica de robots.txt
│   ├── sitemap.ts               # Geração dinâmica de sitemap.xml
│   ├── projeto/
│   │   └── [slug]/
│   │       └── page.tsx         # Página dedicada de detalhes do projeto
│   └── admin/
│       ├── layout.tsx           # Layout com navegação administrativa e AuthProvider
│       ├── page.tsx             # Dashboard com KPIs reais e lista recente
│       ├── login/
│       │   └── page.tsx         # Login por e-mail/senha e recuperação segura
│       ├── projects/
│       │   └── page.tsx         # Gerenciamento CRUD, rascunhos e upload
│       └── profile/
│           └── page.tsx         # Edição de perfil, contatos, WhatsApp e ferramentas
├── components/
│   └── public/
│       ├── Header.tsx           # Top bar conforme o Top Bar Contract
│       ├── Hero.tsx             # Apresentação principal split-screen
│       ├── About.tsx            # Seção Sobre com biografia e currículo
│       ├── Specialties.tsx      # As 4 disciplinas de atuação profissional
│       ├── PortfolioSection.tsx # Grade com filtros segmentados e modal
│       ├── ProjectCard.tsx      # Card de projeto com fallback visual elegante
│       ├── ProjectModal.tsx     # Modal com contexto, processo e vídeo
│       ├── ToolsSection.tsx     # Ferramentas confirmadas sem exagero
│       ├── ContactSection.tsx   # Contato direto (WhatsApp, e-mail, redes)
│       └── Footer.tsx           # Rodapé institucional e link para admin
├── lib/
│   ├── constants.ts             # Dados institucionais iniciais verificados
│   ├── supabase.ts              # Inicialização do cliente Supabase
│   ├── authContext.tsx          # Contexto de autenticação e sessão
│   └── portfolioService.ts      # Camada de serviços de dados e upload
├── supabase/
│   └── migrations/
│       └── 20261019_init_schema.sql # DDL, RLS, índices e seeds SQL
└── types/
    └── portfolio.ts             # Tipos TypeScript estritos
```

---

## 5. Verificação de Qualidade e Comandos

```bash
# Validação de código e sintaxe (zero erros e zero warnings)
npm run lint

# Verificação de build de produção
npm run build
```

---

## 6. Procedimentos de Backup

1. **Banco de dados:** No painel Supabase, acesse **Database** > **Backups** para agendamento diário automático ou exporte via `pg_dump`.
2. **Mídias e Imagens:** Os arquivos de mídia ficam preservados no Supabase Storage e podem ser baixados em lote ou sincronizados via Supabase CLI (`supabase storage cp`).

import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tadeu Peres | Portfólio Profissional',
  description: 'Portfólio de Tadeu Peres: Design Gráfico, Webdesign, Audiovisual e Desenvolvimento Web Júnior com painel administrativo integrado.',
  keywords: ['Tadeu Peres', 'Design Gráfico', 'Webdesign', 'Edição de Vídeo', 'Audiovisual', 'Desenvolvimento Web', 'Portfólio'],
  authors: [{name: 'Tadeu Peres'}],
  creator: 'Tadeu Peres',
  openGraph: {
    title: 'Tadeu Peres | Portfólio Profissional',
    description: 'Design gráfico, experiências web e conteúdo audiovisual para transformar ideias em soluções visuais e digitais.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Tadeu Peres — Portfólio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tadeu Peres | Portfólio Profissional',
    description: 'Design gráfico, experiências web e conteúdo audiovisual para transformar ideias em soluções visuais e digitais.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen bg-[#000000] text-[#F5F7FA] antialiased selection:bg-[#FF7900] selection:text-[#020713]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

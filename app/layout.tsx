import type { Metadata } from 'next';
import './globals.css'; // Importa o Tailwind e os estilos do seu projeto

export const metadata: Metadata = {
  title: 'Tadeu Peres | Frontend Developer Jr & Design Engineer',
  description: 'Portfólio de Tadeu Peres: Desenvolvedor Frontend Júnior especialista em React, TypeScript, HTML5, CSS3, aliado a sólida experiência em Design Gráfico e Edição de Vídeo.',
  openGraph: {
    title: 'Tadeu Peres | Frontend Developer Jr & Design Engineer',
    description: 'Portfólio de Tadeu Peres: Desenvolvedor Frontend Júnior especialista em React, TypeScript, HTML5, CSS3, aliado a sólida experiência em Design Gráfico e Edição de Vídeo.',
    url: 'https://portfolio-tadeuperes.vercel.app/',
    siteName: 'Tadeu Peres Portfólio',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: 'https://portfolio-tadeuperes.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfólio de Tadeu Peres',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tadeu Peres | Frontend Developer Jr & Design Engineer',
    description: 'Portfólio de Tadeu Peres: Desenvolvedor Frontend Júnior especialista em React, TypeScript, HTML5, CSS3, aliado a sólida experiência em Design Gráfico e Edição de Vídeo.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
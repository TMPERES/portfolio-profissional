import { MetadataRoute } from 'next';
import { INITIAL_PROJECTS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://tadeuperes.com.br';
  const now = new Date();

  // Rotas estáticas principais
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Adiciona páginas de projetos publicados
  INITIAL_PROJECTS.filter((p) => p.status === 'published').forEach((project) => {
    routes.push({
      url: `${baseUrl}/projeto/${project.slug}`,
      lastModified: new Date(project.updated_at || project.created_at || now),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  return routes;
}

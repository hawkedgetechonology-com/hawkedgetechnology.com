import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hawkedge.io';
  
  const routes = [
    '',
    '/about',
    '/services',
    '/projects',
    '/case-studies',
    '/industries',
    '/technology',
    '/internships',
    '/careers',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}

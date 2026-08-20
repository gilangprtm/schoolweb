import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smpn17denpasar.my.id';
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/berita`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/profil`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/fasilitas`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/prestasi`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/guru-dan-staf`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/galeri`, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/kontak`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/pendaftaran`, changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  return staticPages.map((page) => ({
    ...page,
    lastModified: page.lastModified || new Date(),
  }));
}

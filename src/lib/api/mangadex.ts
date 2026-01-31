const BASE_URL = 'https://api.mangadex.org';

// List of CORS proxies to try (fallback mechanism)
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];

// Helper to make CORS-proxied requests with fallback
async function fetchWithCors(url: string): Promise<Response> {
  let lastError: Error | null = null;
  
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      if (response.ok) {
        return response;
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`Proxy ${proxy} failed, trying next...`);
    }
  }
  
  throw lastError || new Error('All CORS proxies failed');
}

export interface MangaDexManga {
  id: string;
  type: string;
  attributes: {
    title: { en?: string; ja?: string; ko?: string; [key: string]: string | undefined };
    altTitles: Array<{ [key: string]: string }>;
    description: { en?: string; [key: string]: string | undefined };
    status: string;
    year: number | null;
    contentRating: string;
    tags: Array<{
      id: string;
      attributes: { name: { en: string } };
    }>;
    createdAt: string;
    updatedAt: string;
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: {
      name?: string;
      fileName?: string;
    };
  }>;
}

export interface MangaDexChapter {
  id: string;
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    publishAt: string;
    pages: number;
  };
  relationships: Array<{
    id: string;
    type: string;
  }>;
}

export interface MangaDexResponse<T> {
  result: string;
  response: string;
  data: T;
  limit?: number;
  offset?: number;
  total?: number;
}

// Get cover URL from manga relationships
export function getCoverUrl(manga: MangaDexManga, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const coverRel = manga.relationships.find(r => r.type === 'cover_art');
  if (!coverRel?.attributes?.fileName) {
    return '/placeholder.svg';
  }
  
  const sizeMap = {
    small: '.256.jpg',
    medium: '.512.jpg',
    large: ''
  };
  
  return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}${sizeMap[size]}`;
}

// Get author name from manga relationships
export function getAuthorName(manga: MangaDexManga): string {
  const author = manga.relationships.find(r => r.type === 'author');
  return author?.attributes?.name || 'Unknown Author';
}

// Get artist name from manga relationships
export function getArtistName(manga: MangaDexManga): string {
  const artist = manga.relationships.find(r => r.type === 'artist');
  return artist?.attributes?.name || undefined;
}

// Get title in preferred language
export function getTitle(manga: MangaDexManga): string {
  const titles = manga.attributes.title;
  return titles.en || titles.ko || titles.ja || Object.values(titles)[0] || 'Unknown Title';
}

// Get description in preferred language
export function getDescription(manga: MangaDexManga): string {
  const desc = manga.attributes.description;
  return desc?.en || Object.values(desc || {})[0] || 'No description available.';
}

// Get genres/tags
export function getGenres(manga: MangaDexManga): string[] {
  return manga.attributes.tags
    .filter(tag => tag.attributes?.name?.en)
    .map(tag => tag.attributes.name.en)
    .slice(0, 5);
}

// Map status
export function mapStatus(status: string): 'ongoing' | 'completed' | 'hiatus' {
  const statusMap: Record<string, 'ongoing' | 'completed' | 'hiatus'> = {
    ongoing: 'ongoing',
    completed: 'completed',
    hiatus: 'hiatus',
    cancelled: 'hiatus'
  };
  return statusMap[status] || 'ongoing';
}

// Fetch popular manga (manhwa specifically)
export async function fetchPopularManhwa(limit = 20, offset = 0): Promise<MangaDexResponse<MangaDexManga[]>> {
  const url = `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=author&includes[]=artist&order[followedCount]=desc&originalLanguage[]=ko&availableTranslatedLanguage[]=en&hasAvailableChapters=true&contentRating[]=safe&contentRating[]=suggestive`;
  
  const response = await fetchWithCors(url);
  if (!response.ok) throw new Error('Failed to fetch manhwa');
  return response.json();
}

// Fetch latest updated manhwa
export async function fetchLatestManhwa(limit = 20, offset = 0): Promise<MangaDexResponse<MangaDexManga[]>> {
  const url = `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=author&includes[]=artist&order[latestUploadedChapter]=desc&originalLanguage[]=ko&availableTranslatedLanguage[]=en&hasAvailableChapters=true&contentRating[]=safe&contentRating[]=suggestive`;
  
  const response = await fetchWithCors(url);
  if (!response.ok) throw new Error('Failed to fetch latest manhwa');
  return response.json();
}

// Search manhwa
export async function searchManhwa(query: string, limit = 20, offset = 0): Promise<MangaDexResponse<MangaDexManga[]>> {
  const url = `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=author&includes[]=artist&title=${encodeURIComponent(query)}&originalLanguage[]=ko&availableTranslatedLanguage[]=en&contentRating[]=safe&contentRating[]=suggestive`;
  
  const response = await fetchWithCors(url);
  if (!response.ok) throw new Error('Failed to search manhwa');
  return response.json();
}

// Fetch manga by ID
export async function fetchMangaById(id: string): Promise<MangaDexResponse<MangaDexManga>> {
  const url = `${BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`;
  
  const response = await fetchWithCors(url);
  if (!response.ok) throw new Error('Failed to fetch manga');
  return response.json();
}

// Fetch chapters for a manga
export async function fetchMangaChapters(mangaId: string, limit = 100, offset = 0): Promise<MangaDexResponse<MangaDexChapter[]>> {
  const url = `${BASE_URL}/manga/${mangaId}/feed?limit=${limit}&offset=${offset}&translatedLanguage[]=en&order[chapter]=desc&includes[]=scanlation_group`;
  
  const response = await fetchWithCors(url);
  if (!response.ok) throw new Error('Failed to fetch chapters');
  return response.json();
}

// Fetch chapter pages
export async function fetchChapterPages(chapterId: string): Promise<{ baseUrl: string; chapter: { hash: string; data: string[]; dataSaver: string[] } }> {
  const url = `${BASE_URL}/at-home/server/${chapterId}`;
  
  const response = await fetchWithCors(url);
  if (!response.ok) throw new Error('Failed to fetch chapter pages');
  return response.json();
}

// Get page URLs from chapter data
export function getPageUrls(baseUrl: string, hash: string, pages: string[], dataSaver = false): string[] {
  const quality = dataSaver ? 'data-saver' : 'data';
  return pages.map(page => `${baseUrl}/${quality}/${hash}/${page}`);
}

// Fetch by genre/tag
export async function fetchManhwaByTag(tagId: string, limit = 20, offset = 0): Promise<MangaDexResponse<MangaDexManga[]>> {
  const url = `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=author&includes[]=artist&includedTags[]=${tagId}&originalLanguage[]=ko&availableTranslatedLanguage[]=en&hasAvailableChapters=true&contentRating[]=safe&contentRating[]=suggestive&order[followedCount]=desc`;
  
  const response = await fetchWithCors(url);
  if (!response.ok) throw new Error('Failed to fetch manhwa by tag');
  return response.json();
}

// Fetch all tags
export async function fetchTags(): Promise<MangaDexResponse<Array<{ id: string; attributes: { name: { en: string }; group: string } }>>> {
  const url = `${BASE_URL}/manga/tag`;
  
  const response = await fetchWithCors(url);
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
}

import { apiRequest } from './client';
import { buildRatings, buildOriginalLanguage } from './helpers';
import type {
  MangaDexResponse,
  MangaDexManga,
  MangaDexChapter,
  MangaDexTag,
  ChapterPagesResponse,
  FetchTitlesParams,
  FetchChaptersParams,
  TitleType,
  RatingMode,
} from './types';

// ==================== Core Title Fetcher ====================

export async function fetchTitles(
  params: FetchTitlesParams
): Promise<MangaDexResponse<MangaDexManga[]>> {
  const {
    limit = 20,
    offset = 0,
    type,
    rating = 'all',
    order = 'followedCount',
    availableTranslatedLanguage = ['en'],
    includedTags = [],
    excludedTags = [],
    titleQuery,
    status,
    year,
    hasAvailableChapters = true,
  } = params;

  const q = new URLSearchParams();
  q.set('limit', String(limit));
  q.set('offset', String(offset));

  // Includes for related data
  q.append('includes[]', 'cover_art');
  q.append('includes[]', 'author');
  q.append('includes[]', 'artist');

  // Original language filter
  q.append('originalLanguage[]', buildOriginalLanguage(type));

  // Content ratings
  for (const r of buildRatings(rating)) {
    q.append('contentRating[]', r);
  }

  // Available translated languages
  for (const lang of availableTranslatedLanguage) {
    q.append('availableTranslatedLanguage[]', lang);
  }

  // Tags
  for (const t of includedTags) q.append('includedTags[]', t);
  for (const t of excludedTags) q.append('excludedTags[]', t);

  // Status filter
  if (status) {
    for (const s of status) q.append('status[]', s);
  }

  // Year filter
  if (year) q.set('year', String(year));

  // Has chapters filter
  if (hasAvailableChapters) {
    q.set('hasAvailableChapters', 'true');
  }

  // Title search
  if (titleQuery) q.set('title', titleQuery);

  // Ordering
  const orderMap: Record<string, [string, string]> = {
    followedCount: ['order[followedCount]', 'desc'],
    latestUploadedChapter: ['order[latestUploadedChapter]', 'desc'],
    rating: ['order[rating]', 'desc'],
    createdAt: ['order[createdAt]', 'desc'],
  };
  
  if (orderMap[order]) {
    q.append(...orderMap[order]);
  }

  return apiRequest<MangaDexResponse<MangaDexManga[]>>('/manga', q);
}

// ==================== Search Functions ====================

export async function searchTitles(
  query: string,
  type: TitleType,
  rating: RatingMode = 'all',
  limit = 20,
  offset = 0,
  availableTranslatedLanguage: string[] = ['en']
): Promise<MangaDexResponse<MangaDexManga[]>> {
  return fetchTitles({
    type,
    rating,
    order: 'followedCount',
    titleQuery: query,
    limit,
    offset,
    availableTranslatedLanguage,
  });
}

// Legacy compatibility exports
export const searchManhwa = (query: string, limit = 20, offset = 0) =>
  searchTitles(query, 'manhwa', 'all', limit, offset);

export const searchManga = (query: string, limit = 20, offset = 0) =>
  searchTitles(query, 'manga', 'all', limit, offset);

export const searchAdultManhwa = (query: string, limit = 20, offset = 0) =>
  searchTitles(query, 'manhwa', 'adult', limit, offset);

export const searchAdultManga = (query: string, limit = 20, offset = 0) =>
  searchTitles(query, 'manga', 'adult', limit, offset);

// ==================== Popular Titles ====================

export const fetchPopularManhwa = (limit = 20, offset = 0) =>
  fetchTitles({ type: 'manhwa', rating: 'all', order: 'followedCount', limit, offset });

export const fetchPopularManga = (limit = 20, offset = 0) =>
  fetchTitles({ type: 'manga', rating: 'all', order: 'followedCount', limit, offset });

export const fetchPopularAdultManhwa = (limit = 20, offset = 0) =>
  fetchTitles({ type: 'manhwa', rating: 'adult', order: 'followedCount', limit, offset });

export const fetchPopularAdultManga = (limit = 20, offset = 0) =>
  fetchTitles({ type: 'manga', rating: 'adult', order: 'followedCount', limit, offset });

// ==================== Latest Titles ====================

export const fetchLatestManhwa = (limit = 20, offset = 0) =>
  fetchTitles({ type: 'manhwa', rating: 'all', order: 'latestUploadedChapter', limit, offset });

export const fetchLatestManga = (limit = 20, offset = 0) =>
  fetchTitles({ type: 'manga', rating: 'all', order: 'latestUploadedChapter', limit, offset });

export const fetchLatestAdultManhwa = (limit = 20, offset = 0) =>
  fetchTitles({ type: 'manhwa', rating: 'adult', order: 'latestUploadedChapter', limit, offset });

export const fetchLatestAdultManga = (limit = 20, offset = 0) =>
  fetchTitles({ type: 'manga', rating: 'adult', order: 'latestUploadedChapter', limit, offset });

// ==================== Single Manga ====================

export async function fetchMangaById(
  id: string
): Promise<MangaDexResponse<MangaDexManga>> {
  const q = new URLSearchParams();
  q.append('includes[]', 'cover_art');
  q.append('includes[]', 'author');
  q.append('includes[]', 'artist');

  return apiRequest<MangaDexResponse<MangaDexManga>>(`/manga/${id}`, q);
}

// ==================== Chapters ====================

export async function fetchMangaChapters(
  mangaId: string,
  limit = 100,
  offset = 0,
  translatedLanguage: string[] = ['en'],
  rating: RatingMode = 'all'
): Promise<MangaDexResponse<MangaDexChapter[]>> {
  const q = new URLSearchParams();
  q.set('limit', String(limit));
  q.set('offset', String(offset));

  for (const r of buildRatings(rating)) {
    q.append('contentRating[]', r);
  }

  for (const lang of translatedLanguage) {
    q.append('translatedLanguage[]', lang);
  }

  q.append('order[chapter]', 'desc');
  q.append('order[publishAt]', 'desc');

  return apiRequest<MangaDexResponse<MangaDexChapter[]>>(
    `/manga/${mangaId}/feed`,
    q
  );
}

export async function fetchChapterPagesData(
  chapterId: string
): Promise<ChapterPagesResponse> {
  return apiRequest<ChapterPagesResponse>(
    `/at-home/server/${chapterId}`,
    undefined,
    { skipCache: true } // Don't cache page data
  );
}

// Legacy alias
export const fetchChapterPages = fetchChapterPagesData;

// ==================== Tags ====================

export async function fetchTags(): Promise<MangaDexResponse<MangaDexTag[]>> {
  return apiRequest<MangaDexResponse<MangaDexTag[]>>('/manga/tag');
}

export async function fetchManhwaByTag(
  tagId: string,
  limit = 20,
  offset = 0
): Promise<MangaDexResponse<MangaDexManga[]>> {
  return fetchTitles({
    type: 'manhwa',
    rating: 'all',
    order: 'followedCount',
    includedTags: [tagId],
    limit,
    offset,
  });
}

export async function fetchByTag(
  tagId: string,
  type: TitleType,
  rating: RatingMode = 'all',
  limit = 20,
  offset = 0,
  availableTranslatedLanguage: string[] = ['en']
): Promise<MangaDexResponse<MangaDexManga[]>> {
  return fetchTitles({
    type,
    rating,
    order: 'followedCount',
    includedTags: [tagId],
    limit,
    offset,
    availableTranslatedLanguage,
  });
}

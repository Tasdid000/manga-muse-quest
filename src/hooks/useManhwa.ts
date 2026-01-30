import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchPopularManhwa,
  fetchLatestManhwa,
  searchManhwa,
  fetchMangaById,
  fetchMangaChapters,
  fetchChapterPages,
  fetchManhwaByTag,
  fetchTags,
  getPageUrls,
  MangaDexManga,
  MangaDexChapter,
} from '@/lib/api/mangadex';

// Hook for popular manhwa
export function usePopularManhwa(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['manhwa', 'popular', limit, offset],
    queryFn: () => fetchPopularManhwa(limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for infinite popular manhwa
export function useInfinitePopularManhwa(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['manhwa', 'popular', 'infinite', limit],
    queryFn: ({ pageParam = 0 }) => fetchPopularManhwa(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + (page.data?.length || 0), 0);
      if (lastPage.total && totalFetched < lastPage.total) {
        return totalFetched;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for infinite search manhwa
export function useInfiniteSearchManhwa(query: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: ['manhwa', 'search', 'infinite', query, limit],
    queryFn: ({ pageParam = 0 }) => searchManhwa(query, limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + (page.data?.length || 0), 0);
      if (lastPage.total && totalFetched < lastPage.total) {
        return totalFetched;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for latest manhwa
export function useLatestManhwa(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['manhwa', 'latest', limit, offset],
    queryFn: () => fetchLatestManhwa(limit, offset),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for searching manhwa
export function useSearchManhwa(query: string, limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['manhwa', 'search', query, limit, offset],
    queryFn: () => searchManhwa(query, limit, offset),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for single manga
export function useManga(id: string) {
  return useQuery({
    queryKey: ['manga', id],
    queryFn: () => fetchMangaById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for manga chapters
export function useMangaChapters(mangaId: string, limit = 100, offset = 0) {
  return useQuery({
    queryKey: ['manga', mangaId, 'chapters', limit, offset],
    queryFn: () => fetchMangaChapters(mangaId, limit, offset),
    enabled: !!mangaId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for chapter pages
export function useChapterPages(chapterId: string, dataSaver = false) {
  return useQuery({
    queryKey: ['chapter', chapterId, 'pages', dataSaver],
    queryFn: async () => {
      const data = await fetchChapterPages(chapterId);
      const pages = dataSaver ? data.chapter.dataSaver : data.chapter.data;
      return getPageUrls(data.baseUrl, data.chapter.hash, pages, dataSaver);
    },
    enabled: !!chapterId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for manhwa by tag
export function useManhwaByTag(tagId: string, limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['manhwa', 'tag', tagId, limit, offset],
    queryFn: () => fetchManhwaByTag(tagId, limit, offset),
    enabled: !!tagId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for tags
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Re-export types and utilities
export type { MangaDexManga, MangaDexChapter };

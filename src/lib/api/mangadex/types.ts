// ==================== Core Types ====================

export type TitleType = 'manga' | 'manhwa';
export type RatingMode = 'all' | 'normal' | 'adult';
export type OrderBy = 'followedCount' | 'latestUploadedChapter' | 'rating' | 'createdAt';
export type CoverSize = 'small' | 'medium' | 'large';

export const NORMAL_RATINGS = ['safe', 'suggestive'] as const;
export const ADULT_RATINGS = ['erotica', 'pornographic'] as const;

// ==================== API Response Types ====================

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
    originalLanguage: string;
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

export interface MangaDexTag {
  id: string;
  attributes: {
    name: { en: string };
    group: string;
  };
}

export interface MangaDexResponse<T> {
  result: string;
  response: string;
  data: T;
  limit?: number;
  offset?: number;
  total?: number;
}

export interface ChapterPagesResponse {
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

// ==================== Request Parameter Types ====================

export interface FetchTitlesParams {
  limit?: number;
  offset?: number;
  type: TitleType;
  rating?: RatingMode;
  order?: OrderBy;
  availableTranslatedLanguage?: string[];
  includedTags?: string[];
  excludedTags?: string[];
  titleQuery?: string;
  status?: ('ongoing' | 'completed' | 'hiatus' | 'cancelled')[];
  year?: number;
  hasAvailableChapters?: boolean;
}

export interface FetchChaptersParams {
  mangaId: string;
  limit?: number;
  offset?: number;
  translatedLanguage?: string[];
  rating?: RatingMode;
  orderByChapter?: 'asc' | 'desc';
  orderByPublish?: 'asc' | 'desc';
}

// ==================== Error Types ====================

export class MangaDexError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'MangaDexError';
  }
}

export class RateLimitError extends MangaDexError {
  constructor(retryAfter?: number) {
    super(
      `Rate limited. ${retryAfter ? `Retry after ${retryAfter}s` : ''}`,
      'RATE_LIMITED',
      429
    );
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends MangaDexError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', undefined, details);
    this.name = 'NetworkError';
  }
}

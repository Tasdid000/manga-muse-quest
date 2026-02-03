import type { 
  MangaDexManga, 
  CoverSize, 
  TitleType, 
  RatingMode 
} from './types';
import { NORMAL_RATINGS, ADULT_RATINGS } from './types';

// ==================== Cover URL ====================

export function getCoverUrl(
  manga: MangaDexManga,
  size: CoverSize = 'medium'
): string {
  const coverRel = manga.relationships.find(r => r.type === 'cover_art');
  if (!coverRel?.attributes?.fileName) return '/placeholder.svg';

  const sizeMap: Record<CoverSize, string> = {
    small: '.256.jpg',
    medium: '.512.jpg',
    large: '',
  };

  return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}${sizeMap[size]}`;
}

// ==================== Relationship Extractors ====================

export function getAuthorName(manga: MangaDexManga): string {
  const author = manga.relationships.find(r => r.type === 'author');
  return author?.attributes?.name || 'Unknown Author';
}

export function getArtistName(manga: MangaDexManga): string | undefined {
  const artist = manga.relationships.find(r => r.type === 'artist');
  return artist?.attributes?.name;
}

// ==================== Title & Description ====================

export function getTitle(manga: MangaDexManga, preferredLang?: string): string {
  const titles = manga.attributes.title;
  
  if (preferredLang && titles[preferredLang]) {
    return titles[preferredLang]!;
  }
  
  return titles.en || titles.ko || titles.ja || Object.values(titles)[0] || 'Unknown Title';
}

export function getAltTitles(manga: MangaDexManga): string[] {
  return manga.attributes.altTitles
    .flatMap(obj => Object.values(obj))
    .filter(Boolean) as string[];
}

export function getDescription(manga: MangaDexManga, preferredLang?: string): string {
  const desc = manga.attributes.description;
  if (!desc) return 'No description available.';
  
  if (preferredLang && desc[preferredLang]) {
    return desc[preferredLang]!;
  }
  
  return desc.en || Object.values(desc)[0] || 'No description available.';
}

// ==================== Tags & Genres ====================

export function getGenres(manga: MangaDexManga, limit = 5): string[] {
  return manga.attributes.tags
    .filter(tag => tag.attributes?.name?.en)
    .map(tag => tag.attributes.name.en)
    .slice(0, limit);
}

export function getTagIds(manga: MangaDexManga): string[] {
  return manga.attributes.tags.map(tag => tag.id);
}

export function hasTag(manga: MangaDexManga, tagId: string): boolean {
  return manga.attributes.tags.some(tag => tag.id === tagId);
}

// ==================== Status Mapping ====================

export type MangaStatus = 'ongoing' | 'completed' | 'hiatus';

export function mapStatus(status: string): MangaStatus {
  const statusMap: Record<string, MangaStatus> = {
    ongoing: 'ongoing',
    completed: 'completed',
    hiatus: 'hiatus',
    cancelled: 'hiatus',
  };
  return statusMap[status] || 'ongoing';
}

// ==================== Type Detection ====================

export function isManhwa(manga: MangaDexManga): boolean {
  return manga.attributes.originalLanguage === 'ko';
}

export function isManga(manga: MangaDexManga): boolean {
  return manga.attributes.originalLanguage === 'ja';
}

export function isAdultContent(manga: MangaDexManga): boolean {
  return ['erotica', 'pornographic'].includes(manga.attributes.contentRating);
}

// ==================== Query Builders ====================

export function buildRatings(mode: RatingMode): string[] {
  if (mode === 'normal') return [...NORMAL_RATINGS];
  if (mode === 'adult') return [...ADULT_RATINGS];
  return [...NORMAL_RATINGS, ...ADULT_RATINGS];
}

export function buildOriginalLanguage(type: TitleType): string {
  return type === 'manhwa' ? 'ko' : 'ja';
}

// ==================== Page URL Builder ====================

export function getPageUrls(
  baseUrl: string,
  hash: string,
  pages: string[],
  dataSaver = false
): string[] {
  const quality = dataSaver ? 'data-saver' : 'data';
  return pages.map(page => `${baseUrl}/${quality}/${hash}/${page}`);
}

// ==================== Chapter Utilities ====================

export function parseChapterNumber(chapter: string | null): number | null {
  if (!chapter) return null;
  const num = parseFloat(chapter);
  return isNaN(num) ? null : num;
}

export function formatChapterNumber(chapter: string | null): string {
  if (!chapter) return 'N/A';
  const num = parseFloat(chapter);
  if (isNaN(num)) return chapter;
  return Number.isInteger(num) ? num.toString() : num.toFixed(1);
}

// ==================== Input Validation ====================

/**
 * Validates that a string is a valid MangaDex UUID (v4 format).
 * MangaDex uses UUID v4 for all manga and chapter IDs.
 */
export function isValidMangaDexId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where y is 8, 9, a, or b
  const uuidV4Regex = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return uuidV4Regex.test(id);
}

/**
 * Validates and sanitizes a MangaDex ID, throwing an error if invalid.
 */
export function validateMangaDexId(id: string, fieldName = 'ID'): string {
  if (!isValidMangaDexId(id)) {
    throw new Error(`Invalid ${fieldName} format. Expected a valid UUID.`);
  }
  return id;
}

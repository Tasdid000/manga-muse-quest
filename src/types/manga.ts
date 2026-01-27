export interface Manga {
  id: string;
  title: string;
  cover: string;
  author: string;
  artist?: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  genres: string[];
  rating: number;
  views: number;
  synopsis: string;
  chapters: Chapter[];
  lastUpdated: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  releaseDate: string;
  pages: string[];
}

export interface Genre {
  id: string;
  name: string;
  icon?: string;
}

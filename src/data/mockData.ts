import mangaCover1 from '@/assets/manga-cover-1.jpg';
import mangaCover2 from '@/assets/manga-cover-2.jpg';
import mangaCover3 from '@/assets/manga-cover-3.jpg';
import mangaCover4 from '@/assets/manga-cover-4.jpg';
import mangaCover5 from '@/assets/manga-cover-5.jpg';
import mangaCover6 from '@/assets/manga-cover-6.jpg';
import type { Manga, Genre } from '@/types/manga';

export const genres: Genre[] = [
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'drama', name: 'Drama' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'horror', name: 'Horror' },
  { id: 'romance', name: 'Romance' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'slice-of-life', name: 'Slice of Life' },
  { id: 'sports', name: 'Sports' },
  { id: 'supernatural', name: 'Supernatural' },
  { id: 'thriller', name: 'Thriller' },
];

export const mangaList: Manga[] = [
  {
    id: 'shadow-monarch',
    title: 'Shadow Monarch',
    cover: mangaCover1,
    author: 'Chugong',
    artist: 'Dubu',
    status: 'ongoing',
    genres: ['action', 'fantasy', 'adventure'],
    rating: 4.9,
    views: 2500000,
    synopsis: 'In a world where hunters with supernatural powers fight monsters from dungeons, the weakest hunter of all mankind, Sung Jin-Woo, gains a mysterious power that allows him to level up infinitely. Watch as he rises from the weakest to become the Shadow Monarch, commanding an army of shadows.',
    lastUpdated: '2 hours ago',
    chapters: Array.from({ length: 180 }, (_, i) => ({
      id: `sm-${i + 1}`,
      number: i + 1,
      title: i === 0 ? 'The Weakest Hunter' : `Chapter ${i + 1}`,
      releaseDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 7).toLocaleDateString(),
      pages: [],
    })).reverse(),
  },
  {
    id: 'celestial-blade',
    title: 'Celestial Blade',
    cover: mangaCover2,
    author: 'Yuki Tanaka',
    status: 'ongoing',
    genres: ['action', 'fantasy', 'romance'],
    rating: 4.7,
    views: 1800000,
    synopsis: 'A young warrior with silver hair discovers she is the chosen wielder of the legendary Celestial Blade, a weapon capable of cutting through dimensions. Her journey takes her across realms as she fights to protect the balance between worlds.',
    lastUpdated: '5 hours ago',
    chapters: Array.from({ length: 95 }, (_, i) => ({
      id: `cb-${i + 1}`,
      number: i + 1,
      title: i === 0 ? 'The Chosen One' : `Chapter ${i + 1}`,
      releaseDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 7).toLocaleDateString(),
      pages: [],
    })).reverse(),
  },
  {
    id: 'cherry-blossom-love',
    title: 'Cherry Blossom Love',
    cover: mangaCover3,
    author: 'Sakura Miyamoto',
    status: 'completed',
    genres: ['romance', 'drama', 'slice-of-life'],
    rating: 4.8,
    views: 3200000,
    synopsis: 'Under the cherry blossoms, two high school students find love in the most unexpected ways. A heartwarming tale of first love, friendship, and the bittersweet moments of youth.',
    lastUpdated: '1 day ago',
    chapters: Array.from({ length: 120 }, (_, i) => ({
      id: `cbl-${i + 1}`,
      number: i + 1,
      title: i === 0 ? 'Spring Begins' : `Chapter ${i + 1}`,
      releaseDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 7).toLocaleDateString(),
      pages: [],
    })).reverse(),
  },
  {
    id: 'neon-circuit',
    title: 'Neon Circuit',
    cover: mangaCover4,
    author: 'Kenji Nakamura',
    status: 'ongoing',
    genres: ['sci-fi', 'action', 'thriller'],
    rating: 4.6,
    views: 1500000,
    synopsis: 'In a cyberpunk future where corporations rule, a young man with a mechanical arm uncovers a conspiracy that could change the fate of humanity. Dive into a world of neon lights, high-tech action, and underground resistance.',
    lastUpdated: '12 hours ago',
    chapters: Array.from({ length: 65 }, (_, i) => ({
      id: `nc-${i + 1}`,
      number: i + 1,
      title: i === 0 ? 'System Boot' : `Chapter ${i + 1}`,
      releaseDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 7).toLocaleDateString(),
      pages: [],
    })).reverse(),
  },
  {
    id: 'demon-hunter-chronicles',
    title: 'Demon Hunter Chronicles',
    cover: mangaCover5,
    author: 'Dark Raven',
    status: 'ongoing',
    genres: ['action', 'horror', 'supernatural'],
    rating: 4.8,
    views: 2100000,
    synopsis: 'A mysterious hunter with demonic powers walks the line between light and darkness. Wielding forbidden techniques, they hunt the demons that threaten humanity while fighting their own inner demons.',
    lastUpdated: '3 hours ago',
    chapters: Array.from({ length: 145 }, (_, i) => ({
      id: `dhc-${i + 1}`,
      number: i + 1,
      title: i === 0 ? 'Into Darkness' : `Chapter ${i + 1}`,
      releaseDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 7).toLocaleDateString(),
      pages: [],
    })).reverse(),
  },
  {
    id: 'slam-kings',
    title: 'Slam Kings',
    cover: mangaCover6,
    author: 'Takeshi Inoue',
    status: 'ongoing',
    genres: ['sports', 'comedy', 'drama'],
    rating: 4.5,
    views: 980000,
    synopsis: 'A talented but undisciplined basketball player joins a struggling high school team. Through hard work, teamwork, and countless matches, watch them transform from outcasts to champions.',
    lastUpdated: '6 hours ago',
    chapters: Array.from({ length: 85 }, (_, i) => ({
      id: `sk-${i + 1}`,
      number: i + 1,
      title: i === 0 ? 'New Recruit' : `Chapter ${i + 1}`,
      releaseDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 7).toLocaleDateString(),
      pages: [],
    })).reverse(),
  },
];

export const featuredManga = mangaList[0];
export const popularManga = [...mangaList].sort((a, b) => b.views - a.views);
export const latestUpdates = [...mangaList].sort((a, b) => {
  const parseTime = (time: string) => {
    if (time.includes('hour')) return parseInt(time) * 60;
    if (time.includes('day')) return parseInt(time) * 60 * 24;
    return 0;
  };
  return parseTime(a.lastUpdated) - parseTime(b.lastUpdated);
});

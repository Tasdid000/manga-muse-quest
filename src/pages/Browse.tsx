import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { mangaList, genres } from '@/data/mockData';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((g) => g !== genreId)
        : [...prev, genreId]
    );
  };

  const filteredManga = mangaList.filter((manga) => {
    const matchesSearch = manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manga.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenres = selectedGenres.length === 0 ||
      selectedGenres.some((g) => manga.genres.includes(g));
    return matchesSearch && matchesGenres;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="container py-8">
        <h1 className="mb-6 text-3xl font-bold text-foreground">Browse Manga</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Genre Filter */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Filter by Genre</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge
                key={genre.id}
                variant={selectedGenres.includes(genre.id) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleGenre(genre.id)}
              >
                {genre.name}
              </Badge>
            ))}
            {selectedGenres.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGenres([])}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {filteredManga.length > 0 ? (
          <MangaGrid manga={filteredManga} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No manga found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Browse;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Sparkles, BookOpen } from 'lucide-react';
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

      <main className="container py-12">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 shadow-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground md:text-4xl">Browse Manga</h1>
              <p className="text-muted-foreground">Discover your next favorite story</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <form onSubmit={handleSearch} className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl border-border/50 bg-card/50 pl-12 pr-4 text-lg backdrop-blur-sm transition-all focus:border-primary focus:bg-card focus:shadow-xl"
            />
          </div>
        </form>

        {/* Genre Filter */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Filter by Genre</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <Badge
                  key={genre.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isSelected 
                      ? 'border-0 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg hover:opacity-90' 
                      : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/10'
                  }`}
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </Badge>
              );
            })}
            {selectedGenres.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGenres([])}
                className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Found <span className="font-bold text-foreground">{filteredManga.length}</span> manga
        </div>

        {/* Results */}
        {filteredManga.length > 0 ? (
          <MangaGrid manga={filteredManga} />
        ) : (
          <div className="animate-fade-in rounded-2xl border border-border/30 bg-card/50 py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No manga found</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                setSearchQuery('');
                setSelectedGenres([]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
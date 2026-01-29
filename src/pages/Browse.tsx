import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MangaCardAPI } from '@/components/manga/MangaCardAPI';
import { MangaCardSkeleton } from '@/components/manga/MangaCardSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, BookOpen, Loader2 } from 'lucide-react';
import { usePopularManhwa, useLatestManhwa, useSearchManhwa, useTags } from '@/hooks/useManhwa';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data based on context
  const { data: popularData, isLoading: popularLoading } = usePopularManhwa(30);
  const { data: latestData, isLoading: latestLoading } = useLatestManhwa(30);
  const { data: searchData, isLoading: searchLoading } = useSearchManhwa(debouncedQuery, 30);
  const { data: tagsData } = useTags();

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

  // Get genre tags (limit to common ones)
  const genres = useMemo(() => {
    if (!tagsData?.data) return [];
    return tagsData.data
      .filter(tag => tag.attributes.group === 'genre')
      .map(tag => ({
        id: tag.id,
        name: tag.attributes.name.en
      }))
      .slice(0, 15);
  }, [tagsData]);

  // Determine which data to show
  const isSearching = debouncedQuery.length > 0;
  const data = isSearching ? searchData : popularData;
  const isLoading = isSearching ? searchLoading : popularLoading;

  // Filter by selected genres
  const filteredManga = useMemo(() => {
    if (!data?.data) return [];
    if (selectedGenres.length === 0) return data.data;
    
    return data.data.filter(manga => {
      const mangaTagIds = manga.attributes.tags.map(t => t.id);
      return selectedGenres.some(g => mangaTagIds.includes(g));
    });
  }, [data, selectedGenres]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
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
              <h1 className="text-3xl font-black text-foreground md:text-4xl">Browse Manhwa</h1>
              <p className="text-muted-foreground">Discover your next favorite Korean webtoon</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <form onSubmit={handleSearch} className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search manhwa by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl border-border/50 bg-card/50 pl-12 pr-4 text-lg backdrop-blur-sm transition-all focus:border-primary focus:bg-card focus:shadow-xl"
            />
            {searchLoading && debouncedQuery && (
              <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />
            )}
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
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              Found <span className="font-bold text-foreground">{filteredManga.length}</span> manhwa
              {isSearching && <span className="ml-1">for "{debouncedQuery}"</span>}
            </>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <MangaCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredManga.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredManga.map((manga, index) => (
              <MangaCardAPI key={manga.id} manga={manga} index={index} />
            ))}
          </div>
        ) : (
          <div className="animate-fade-in rounded-2xl border border-border/30 bg-card/50 py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No manhwa found</p>
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

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroBanner } from '@/components/manga/HeroBanner';
import { GenreList } from '@/components/manga/GenreList';
import { MangaCardAPI } from '@/components/manga/MangaCardAPI';
import { MangaCardSkeleton } from '@/components/manga/MangaCardSkeleton';
import { usePopularManhwa, useLatestManhwa } from '@/hooks/useManhwa';
import { getTitle, getCoverUrl, getDescription, getGenres, mapStatus, getAuthorName } from '@/lib/api/mangadex';
import { genres } from '@/data/mockData';
import { Flame, Clock, Crown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isDark, setIsDark] = useState(true);

  const { data: popularData, isLoading: popularLoading } = usePopularManhwa(12);
  const { data: latestData, isLoading: latestLoading } = useLatestManhwa(6);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Transform first popular manga for hero banner
  const featuredManga = popularData?.data?.[0] ? {
    id: popularData.data[0].id,
    title: getTitle(popularData.data[0]),
    cover: getCoverUrl(popularData.data[0], 'large'),
    author: getAuthorName(popularData.data[0]),
    status: mapStatus(popularData.data[0].attributes.status),
    genres: getGenres(popularData.data[0]),
    rating: 4.9,
    views: 2500000,
    synopsis: getDescription(popularData.data[0]),
    chapters: [],
    lastUpdated: 'Recently'
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      
      <main>
        {/* Hero Section */}
        {featuredManga ? (
          <HeroBanner manga={featuredManga} />
        ) : (
          <div className="relative h-[70vh] min-h-[500px] animate-pulse bg-secondary" />
        )}

        <div className="container space-y-20 py-20">
          {/* Genres Section */}
          <GenreList genres={genres} />

          {/* Trending Section */}
          <section className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-orange-600/20 shadow-lg">
                  <Flame className="h-6 w-6 text-accent" />
                  <div className="absolute inset-0 animate-pulse-glow rounded-2xl bg-accent/20 blur-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                    Trending Manhwa
                  </h2>
                  <p className="text-sm text-muted-foreground">Most popular this week</p>
                </div>
              </div>
              <Link to="/popular">
                <Button variant="ghost" className="group gap-2 text-primary transition-all duration-300 hover:bg-primary/10">
                  View All
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {popularLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MangaCardSkeleton key={i} />
                ))
              ) : (
                popularData?.data?.slice(1, 7).map((manga, index) => (
                  <MangaCardAPI key={manga.id} manga={manga} index={index} />
                ))
              )}
            </div>
          </section>

          {/* Latest Updates Section */}
          <section className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 shadow-lg">
                  <Clock className="h-6 w-6 text-primary" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                    Latest Updates
                  </h2>
                  <p className="text-sm text-muted-foreground">Fresh chapters just released</p>
                </div>
              </div>
              <Link to="/latest">
                <Button variant="ghost" className="group gap-2 text-primary transition-all duration-300 hover:bg-primary/10">
                  View All
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latestLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MangaCardSkeleton key={i} variant="compact" />
                ))
              ) : (
                latestData?.data?.slice(0, 6).map((manga, index) => (
                  <MangaCardAPI key={manga.id} manga={manga} variant="compact" index={index} />
                ))
              )}
            </div>
          </section>

          {/* Editor's Picks */}
          <section className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 shadow-lg">
                  <Crown className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                    Editor's Picks
                  </h2>
                  <p className="text-sm text-muted-foreground">Curated just for you</p>
                </div>
              </div>
              <Link to="/featured">
                <Button variant="ghost" className="group gap-2 text-primary transition-all duration-300 hover:bg-primary/10">
                  View All
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {popularLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MangaCardSkeleton key={i} />
                ))
              ) : (
                popularData?.data?.slice(6, 12).map((manga, index) => (
                  <MangaCardAPI key={manga.id} manga={manga} index={index} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

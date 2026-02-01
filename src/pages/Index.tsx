import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroBannerSlider } from '@/components/manga/HeroBannerSlider';
import { GenreList } from '@/components/manga/GenreList';
import { MangaCardAPI } from '@/components/manga/MangaCardAPI';
import { MangaCardSkeleton } from '@/components/manga/MangaCardSkeleton';
import { usePopularManhwa, useLatestManhwa } from '@/hooks/useManhwa';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { genres } from '@/data/mockData';
import { Flame, Clock, Crown, ChevronRight, History, BookOpen, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [isDark, setIsDark] = useState(true);

  const { data: popularData, isLoading: popularLoading } = usePopularManhwa(12);
  const { data: latestData, isLoading: latestLoading } = useLatestManhwa(6);
  const { history } = useReadingHistory();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      
      <main>
        {/* Hero Section with Slider */}
        {popularData?.data && popularData.data.length > 0 ? (
          <HeroBannerSlider mangaList={popularData.data.slice(0, 5)} />
        ) : (
          <div className="relative h-[70vh] min-h-[500px] animate-pulse bg-secondary" />
        )}

        <div className="container space-y-20 py-20">
          {/* Continue Reading Section */}
          {history.length > 0 && (
            <section className="animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 shadow-lg">
                    <History className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                      Continue Reading
                    </h2>
                    <p className="text-sm text-muted-foreground">Pick up where you left off</p>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {history.slice(0, 6).map((entry, index) => (
                  <Link
                    key={entry.mangaId}
                    to={`/manga/${entry.mangaId}/chapter/${entry.chapterId}`}
                    className="group relative flex gap-4 overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-card/80 to-card/40 p-4 backdrop-blur-sm transition-all duration-500 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-emerald-500/0 opacity-0 transition-all duration-500 group-hover:opacity-100" />
                    
                    <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={entry.coverUrl}
                        alt={entry.mangaTitle}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="relative flex flex-1 flex-col justify-center">
                      <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors duration-300 group-hover:text-green-500">
                        {entry.mangaTitle}
                      </h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Chapter {entry.chapterNumber}</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                            style={{ width: `${((entry.pageNumber + 1) / entry.totalPages) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {entry.pageNumber + 1}/{entry.totalPages}
                        </span>
                      </div>
                      <Badge className="mt-2 w-fit gap-1 border-0 bg-green-500/20 text-green-500">
                        <Play className="h-3 w-3 fill-current" />
                        Continue
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

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

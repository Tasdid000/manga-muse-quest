import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroBanner } from '@/components/manga/HeroBanner';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { GenreList } from '@/components/manga/GenreList';
import { LatestUpdates } from '@/components/manga/LatestUpdates';
import { featuredManga, popularManga, latestUpdates, genres } from '@/data/mockData';
import { TrendingUp, Flame, Crown, Sparkles } from 'lucide-react';

const Index = () => {
  const [isDark, setIsDark] = useState(true);

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
        {/* Hero Section */}
        <HeroBanner manga={featuredManga} />

        <div className="container space-y-20 py-20">
          {/* Genres Section */}
          <GenreList genres={genres} />

          {/* Trending Section with Enhanced Header */}
          <section className="animate-fade-in">
            <div className="mb-8 flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-orange-600/20 shadow-lg">
                <Flame className="h-6 w-6 text-accent" />
                {/* Fire animation effect */}
                <div className="absolute inset-0 animate-pulse-glow rounded-2xl bg-accent/20 blur-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                  Trending Now
                </h2>
                <p className="text-sm text-muted-foreground">Most popular this week</p>
              </div>
            </div>
            <MangaGrid 
              manga={popularManga.slice(0, 6)} 
              showAll="/popular" 
            />
          </section>

          {/* Latest Updates Section */}
          <LatestUpdates manga={latestUpdates} />

          {/* Editor's Picks Section */}
          <section className="animate-fade-in">
            <div className="mb-8 flex items-center gap-3">
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
            <MangaGrid 
              manga={popularManga.slice(3, 9)} 
              showAll="/featured" 
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroBanner } from '@/components/manga/HeroBanner';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { GenreList } from '@/components/manga/GenreList';
import { LatestUpdates } from '@/components/manga/LatestUpdates';
import { featuredManga, popularManga, latestUpdates, genres } from '@/data/mockData';
import { TrendingUp } from 'lucide-react';

const Index = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Default to dark mode for manga reading
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

        <div className="container space-y-16 py-16">
          {/* Genres */}
          <GenreList genres={genres} />

          {/* Popular Manga with Custom Header */}
          <section className="animate-fade-in">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Trending Now
              </h2>
            </div>
            <MangaGrid 
              manga={popularManga.slice(0, 6)} 
              showAll="/popular" 
            />
          </section>

          {/* Latest Updates */}
          <LatestUpdates manga={latestUpdates} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroBanner } from '@/components/manga/HeroBanner';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { GenreList } from '@/components/manga/GenreList';
import { LatestUpdates } from '@/components/manga/LatestUpdates';
import { featuredManga, popularManga, latestUpdates, genres } from '@/data/mockData';

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

        <div className="container space-y-12 py-12">
          {/* Genres */}
          <GenreList genres={genres} />

          {/* Popular Manga */}
          <MangaGrid 
            manga={popularManga.slice(0, 6)} 
            title="Popular Manga" 
            showAll="/popular" 
          />

          {/* Latest Updates */}
          <LatestUpdates manga={latestUpdates} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

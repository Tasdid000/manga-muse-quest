import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, BookOpen, TrendingUp, Users, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  MangaDexManga, 
  getCoverUrl, 
  getTitle, 
  getDescription, 
  getAuthorName,
  mapStatus,
  fetchMangaChapters
} from '@/lib/api/mangadex';
import { useQuery } from '@tanstack/react-query';

interface HeroBannerSliderProps {
  mangaList: MangaDexManga[];
}

interface MangaWithChapters {
  manga: MangaDexManga;
  chapterCount: number;
  latestChapter: string | null;
}

export function HeroBannerSlider({ mangaList }: HeroBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch chapter counts for all manga in the slider
  const { data: mangaWithChapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ['heroChapters', mangaList.map(m => m.id).join(',')],
    queryFn: async () => {
      const results: MangaWithChapters[] = await Promise.all(
        mangaList.slice(0, 5).map(async (manga) => {
          try {
            const chaptersData = await fetchMangaChapters(manga.id, 100, 0);
            // Get total count and find the highest chapter number
            const chapters = chaptersData.data || [];
            const chapterNumbers = chapters
              .map(ch => parseFloat(ch.attributes?.chapter || '0'))
              .filter(n => !isNaN(n) && n > 0);
            
            const latestChapter = chapterNumbers.length > 0 
              ? Math.max(...chapterNumbers).toString()
              : null;
            
            return {
              manga,
              chapterCount: chaptersData.total || chapters.length,
              latestChapter
            };
          } catch {
            return { manga, chapterCount: 0, latestChapter: null };
          }
        })
      );
      return results;
    },
    enabled: mangaList.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const items = mangaWithChapters || mangaList.slice(0, 5).map(manga => ({
    manga,
    chapterCount: 0,
    latestChapter: null
  }));

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, items.length]);

  if (items.length === 0) {
    return <div className="relative h-[700px] animate-pulse bg-secondary md:h-[800px]" />;
  }

  const currentItem = items[currentIndex];
  const manga = currentItem.manga;
  const title = getTitle(manga);
  const description = getDescription(manga);
  const author = getAuthorName(manga);
  const status = mapStatus(manga.attributes.status);
  const cover = getCoverUrl(manga, 'large');
  
  // Generate pseudo-random rating and views based on manga id
  const rating = (4 + (parseInt(manga.id.slice(0, 8), 16) % 10) / 10).toFixed(1);
  const viewsHash = Math.abs(parseInt(manga.id.replace(/-/g, '').slice(0, 8), 16));
  const views = ((viewsHash % 9000) + 1000) * 1000;

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <section 
      className="relative min-h-[700px] w-full overflow-hidden md:min-h-[800px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Transition */}
      {items.map((item, index) => (
        <div
          key={item.manga.id}
          className={cn(
            "absolute inset-0 scale-110 bg-cover bg-center transition-all duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${getCoverUrl(item.manga, 'large')})` }}
        >
          {/* Advanced Multi-layer Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/15" />
          
          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }} />
        </div>
      ))}

      {/* Animated Decorative Elements */}
      <div className="absolute right-[10%] top-[15%] h-96 w-96 animate-pulse-glow rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute bottom-[20%] left-[20%] h-64 w-64 animate-float rounded-full bg-accent/15 blur-[80px]" />
      <div className="absolute right-[30%] top-[50%] h-48 w-48 rounded-full bg-primary/10 blur-[60px]" />

      {/* Content */}
      <div className="container relative flex h-full min-h-[700px] items-center py-24 md:min-h-[800px]">
        <div className="max-w-2xl space-y-8">
          {/* Badges */}
          <div className="flex animate-fade-in flex-wrap items-center gap-3">
            <Badge className="border-0 bg-gradient-to-r from-primary via-purple-600 to-primary px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-xl shadow-primary/30">
              <Sparkles className="mr-2 h-4 w-4" />
              Featured
            </Badge>
            <Badge 
              variant="outline" 
              className="border-border/50 bg-background/40 px-4 py-2 capitalize backdrop-blur-md"
            >
              <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-accent" />
              {status}
            </Badge>
            <Badge 
              variant="outline" 
              className="border-border/50 bg-background/40 px-4 py-2 backdrop-blur-md"
            >
              <Users className="mr-1.5 h-3.5 w-3.5 text-primary" />
              {formatViews(views)} readers
            </Badge>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up text-5xl font-black leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          {/* Synopsis */}
          <p className="animate-fade-in line-clamp-3 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {description}
          </p>

          {/* Stats Row */}
          <div className="animate-fade-in flex flex-wrap items-center gap-4">
            {/* Rating Card */}
            <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/20 to-accent/5 px-5 py-3 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Star className="h-5 w-5 fill-accent text-accent" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
            
            {/* Chapters Card */}
            <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 px-5 py-3 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">
                  {chaptersLoading ? '...' : currentItem.chapterCount > 0 ? currentItem.chapterCount : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentItem.chapterCount > 0 ? 'Chapters' : 'No EN chapters'}
                </p>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">By</span>
              <span className="font-bold text-foreground">{author}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="animate-fade-in-up flex flex-wrap items-center gap-4">
            <Link to={`/manga/${manga.id}`}>
              <Button 
                size="lg" 
                className="group relative h-14 overflow-hidden rounded-xl bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] px-8 text-lg font-bold shadow-xl shadow-primary/30 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-2xl hover:shadow-primary/40"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20 transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  Start Reading
                </span>
              </Button>
            </Link>
            <Link to={`/manga/${manga.id}`}>
              <Button 
                size="lg" 
                variant="outline" 
                className="group h-14 rounded-xl border-2 border-border/50 bg-background/30 px-8 text-lg font-bold backdrop-blur-md transition-all duration-500 hover:border-primary hover:bg-primary/10 hover:shadow-xl"
              >
                <BookOpen className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                View Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Cover Image Preview */}
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl" />
            <img 
              src={cover} 
              alt={title}
              className="relative h-[450px] w-[320px] rounded-2xl object-cover shadow-2xl transition-all duration-500"
            />
            {currentItem.latestChapter ? (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
                Latest: Ch. {currentItem.latestChapter}
              </div>
            ) : currentItem.chapterCount > 0 ? (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
                {currentItem.chapterCount} Chapters
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {items.length > 1 && (
        <>
          {/* Arrow Buttons */}
          <div className="absolute bottom-32 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 md:bottom-24">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="h-12 w-12 rounded-full border-border/50 bg-background/50 backdrop-blur-md hover:bg-background/80"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentIndex 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="h-12 w-12 rounded-full border-border/50 bg-background/50 backdrop-blur-md hover:bg-background/80"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </>
      )}

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}

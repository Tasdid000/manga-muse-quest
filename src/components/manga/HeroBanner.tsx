import { Link } from 'react-router-dom';
import { Play, Star, BookOpen, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import heroBanner from '@/assets/hero-banner.jpg';
import type { Manga } from '@/types/manga';

interface HeroBannerProps {
  manga: Manga;
}

export function HeroBanner({ manga }: HeroBannerProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <section className="relative min-h-[600px] w-full overflow-hidden md:min-h-[700px]">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-700"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        {/* Multi-layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      </div>

      {/* Animated Decorative Elements */}
      <div className="absolute right-10 top-20 h-72 w-72 animate-pulse-glow rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-20 left-1/3 h-48 w-48 animate-float rounded-full bg-accent/10 blur-2xl" />

      {/* Content */}
      <div className="container relative flex h-full min-h-[600px] items-center py-20 md:min-h-[700px]">
        <div className="max-w-2xl space-y-8">
          {/* Badges with Animation */}
          <div className="flex animate-fade-in items-center gap-3" style={{ animationDelay: '0.1s' }}>
            <Badge className="border-0 bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg">
              <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
              Featured
            </Badge>
            <Badge 
              variant="outline" 
              className="border-border/50 bg-background/50 px-3 py-1.5 capitalize backdrop-blur-sm"
            >
              {manga.status}
            </Badge>
            <Badge 
              variant="outline" 
              className="border-border/50 bg-background/50 px-3 py-1.5 backdrop-blur-sm"
            >
              <Users className="mr-1.5 h-3 w-3" />
              {formatViews(manga.views)} readers
            </Badge>
          </div>

          {/* Title with Gradient */}
          <h1 
            className="animate-fade-in-up bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-6xl lg:text-7xl"
            style={{ animationDelay: '0.2s' }}
          >
            {manga.title}
          </h1>

          {/* Synopsis */}
          <p 
            className="animate-fade-in line-clamp-3 text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ animationDelay: '0.3s' }}
          >
            {manga.synopsis}
          </p>

          {/* Stats Row */}
          <div 
            className="animate-fade-in flex flex-wrap items-center gap-6 text-sm"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2">
              <Star className="h-5 w-5 fill-accent text-accent" />
              <span className="font-bold text-foreground">{manga.rating}</span>
              <span className="text-muted-foreground">Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{manga.chapters.length}</span>
              <span className="text-muted-foreground">Chapters</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>By</span>
              <span className="font-semibold text-foreground">{manga.author}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className="animate-fade-in-up flex items-center gap-4"
            style={{ animationDelay: '0.5s' }}
          >
            <Link to={`/manga/${manga.id}/chapter/${manga.chapters[manga.chapters.length - 1]?.id}`}>
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 px-8 py-6 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Start Reading
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </Button>
            </Link>
            <Link to={`/manga/${manga.id}`}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-border/50 bg-background/30 px-8 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/10"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

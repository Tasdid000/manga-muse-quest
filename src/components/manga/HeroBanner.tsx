import { Link } from 'react-router-dom';
import { Play, Star, BookOpen, TrendingUp, Users, Sparkles } from 'lucide-react';
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
    <section className="relative min-h-[700px] w-full overflow-hidden md:min-h-[800px]">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroBanner})` }}
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

      {/* Animated Decorative Elements */}
      <div className="absolute right-[10%] top-[15%] h-96 w-96 animate-pulse-glow rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute bottom-[20%] left-[20%] h-64 w-64 animate-float rounded-full bg-accent/15 blur-[80px]" />
      <div className="absolute right-[30%] top-[50%] h-48 w-48 rounded-full bg-primary/10 blur-[60px]" style={{ animationDelay: '1s' }} />

      {/* Floating Particles */}
      <div className="absolute left-[15%] top-[30%] h-2 w-2 animate-float rounded-full bg-primary/60" style={{ animationDelay: '0.5s' }} />
      <div className="absolute right-[25%] top-[20%] h-1.5 w-1.5 animate-float rounded-full bg-accent/80" style={{ animationDelay: '1.2s' }} />
      <div className="absolute bottom-[30%] right-[15%] h-3 w-3 animate-float rounded-full bg-primary/40" style={{ animationDelay: '0.8s' }} />

      {/* Content */}
      <div className="container relative flex h-full min-h-[700px] items-center py-24 md:min-h-[800px]">
        <div className="max-w-2xl space-y-8">
          {/* Badges with Stagger Animation */}
          <div className="flex animate-fade-in flex-wrap items-center gap-3" style={{ animationDelay: '0.1s' }}>
            <Badge className="border-0 bg-gradient-to-r from-primary via-purple-600 to-primary px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-xl shadow-primary/30">
              <Sparkles className="mr-2 h-4 w-4" />
              Featured
            </Badge>
            <Badge 
              variant="outline" 
              className="border-border/50 bg-background/40 px-4 py-2 capitalize backdrop-blur-md"
            >
              <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-accent" />
              {manga.status}
            </Badge>
            <Badge 
              variant="outline" 
              className="border-border/50 bg-background/40 px-4 py-2 backdrop-blur-md"
            >
              <Users className="mr-1.5 h-3.5 w-3.5 text-primary" />
              {formatViews(manga.views)} readers
            </Badge>
          </div>

          {/* Title with Enhanced Gradient */}
          <h1 
            className="animate-fade-in-up text-5xl font-black leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              {manga.title}
            </span>
          </h1>

          {/* Synopsis with Better Typography */}
          <p 
            className="animate-fade-in line-clamp-3 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ animationDelay: '0.3s' }}
          >
            {manga.synopsis}
          </p>

          {/* Enhanced Stats Row */}
          <div 
            className="animate-fade-in flex flex-wrap items-center gap-4"
            style={{ animationDelay: '0.4s' }}
          >
            {/* Rating Card */}
            <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/20 to-accent/5 px-5 py-3 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Star className="h-5 w-5 fill-accent text-accent" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{manga.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
            
            {/* Chapters Card */}
            <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 px-5 py-3 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{manga.chapters.length}</p>
                <p className="text-xs text-muted-foreground">Chapters</p>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">By</span>
              <span className="font-bold text-foreground">{manga.author}</span>
            </div>
          </div>

          {/* Premium Action Buttons */}
          <div 
            className="animate-fade-in-up flex flex-wrap items-center gap-4"
            style={{ animationDelay: '0.5s' }}
          >
            <Link to={`/manga/${manga.id}/chapter/${manga.chapters[manga.chapters.length - 1]?.id}`}>
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
      </div>

      {/* Enhanced Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}
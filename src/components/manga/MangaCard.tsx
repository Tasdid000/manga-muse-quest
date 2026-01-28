import { Link } from 'react-router-dom';
import { Star, Eye, Clock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Manga } from '@/types/manga';
import { cn } from '@/lib/utils';

interface MangaCardProps {
  manga: Manga;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
}

export function MangaCard({ manga, variant = 'default', index = 0 }: MangaCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  if (variant === 'compact') {
    return (
      <Link
        to={`/manga/${manga.id}`}
        className="group relative flex gap-4 overflow-hidden rounded-xl bg-card/50 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg"
        style={{ 
          animationDelay: `${index * 0.05}s`,
        }}
      >
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={manga.cover}
            alt={manga.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        
        <div className="relative flex flex-1 flex-col justify-center">
          <h3 className="line-clamp-1 font-semibold text-foreground transition-colors group-hover:text-primary">
            {manga.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            <BookOpen className="mr-1 inline h-3 w-3" />
            Chapter {manga.chapters[0]?.number}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{manga.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span>{manga.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/manga/${manga.id}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card transition-all duration-500',
        'hover:-translate-y-2 hover:shadow-2xl',
        variant === 'featured' && 'md:flex md:h-72'
      )}
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />
      
      {/* Cover Image */}
      <div
        className={cn(
          'relative overflow-hidden',
          variant === 'featured' ? 'h-52 md:h-full md:w-48 md:flex-shrink-0' : 'aspect-[3/4]'
        )}
      >
        <img
          src={manga.cover}
          alt={manga.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Status Badge */}
        <Badge
          className={cn(
            'absolute right-3 top-3 border-0 text-xs font-semibold capitalize shadow-lg backdrop-blur-sm',
            manga.status === 'completed' 
              ? 'bg-accent/90 text-accent-foreground' 
              : 'bg-primary/90 text-primary-foreground'
          )}
        >
          {manga.status}
        </Badge>

        {/* Rating - Bottom Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-foreground">{manga.rating}</span>
        </div>

        {/* Views - Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-sm backdrop-blur-sm">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{formatViews(manga.views)}</span>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        'relative p-4',
        variant === 'featured' && 'md:flex md:flex-1 md:flex-col md:justify-center md:p-6'
      )}>
        <h3 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
          {manga.title}
        </h3>
        
        {variant === 'featured' && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {manga.synopsis}
          </p>
        )}

        {/* Genres */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {manga.genres.slice(0, variant === 'featured' ? 3 : 2).map((genre) => (
            <Badge 
              key={genre} 
              variant="outline" 
              className="border-border/50 bg-secondary/50 text-xs capitalize transition-colors group-hover:border-primary/50"
            >
              {genre}
            </Badge>
          ))}
        </div>

        {/* Chapter Info */}
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>{manga.chapters.length} Chapters</span>
          </div>
          {variant !== 'featured' && (
            <span className="text-xs">Ch. {manga.chapters[0]?.number}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

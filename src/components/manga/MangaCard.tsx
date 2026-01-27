import { Link } from 'react-router-dom';
import { Star, Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Manga } from '@/types/manga';
import { cn } from '@/lib/utils';

interface MangaCardProps {
  manga: Manga;
  variant?: 'default' | 'compact' | 'featured';
}

export function MangaCard({ manga, variant = 'default' }: MangaCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  if (variant === 'compact') {
    return (
      <Link
        to={`/manga/${manga.id}`}
        className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
      >
        <img
          src={manga.cover}
          alt={manga.title}
          className="h-20 w-14 flex-shrink-0 rounded-md object-cover"
        />
        <div className="flex flex-col justify-center">
          <h3 className="line-clamp-1 font-medium text-foreground group-hover:text-primary">
            {manga.title}
          </h3>
          <p className="text-xs text-muted-foreground">Ch. {manga.chapters[0]?.number}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{manga.lastUpdated}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/manga/${manga.id}`}
      className={cn(
        'group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg',
        variant === 'featured' && 'md:flex md:h-64'
      )}
    >
      {/* Cover Image */}
      <div
        className={cn(
          'relative overflow-hidden',
          variant === 'featured' ? 'h-48 md:h-full md:w-44 md:flex-shrink-0' : 'aspect-[3/4]'
        )}
      >
        <img
          src={manga.cover}
          alt={manga.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        
        {/* Status Badge */}
        <Badge
          variant={manga.status === 'completed' ? 'secondary' : 'default'}
          className="absolute right-2 top-2 text-xs capitalize"
        >
          {manga.status}
        </Badge>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-sm text-primary-foreground">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-medium">{manga.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className={cn('p-3', variant === 'featured' && 'md:flex md:flex-1 md:flex-col md:p-4')}>
        <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
          {manga.title}
        </h3>
        
        {variant === 'featured' && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{manga.synopsis}</p>
        )}

        <div className="mt-2 flex flex-wrap gap-1">
          {manga.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs capitalize">
              {genre}
            </Badge>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{formatViews(manga.views)}</span>
          </div>
          <span>Ch. {manga.chapters[0]?.number}</span>
        </div>
      </div>
    </Link>
  );
}

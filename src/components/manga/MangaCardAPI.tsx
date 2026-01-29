import { Link } from 'react-router-dom';
import { Star, Eye, Clock, BookOpen, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  MangaDexManga, 
  getCoverUrl, 
  getTitle, 
  getGenres, 
  mapStatus,
  getDescription 
} from '@/lib/api/mangadex';

interface MangaCardAPIProps {
  manga: MangaDexManga;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
  chaptersCount?: number;
  latestChapter?: string;
  lastUpdated?: string;
}

export function MangaCardAPI({ 
  manga, 
  variant = 'default', 
  index = 0,
  chaptersCount = 0,
  latestChapter,
  lastUpdated = 'Recently'
}: MangaCardAPIProps) {
  const title = getTitle(manga);
  const cover = getCoverUrl(manga, 'medium');
  const genres = getGenres(manga);
  const status = mapStatus(manga.attributes.status);
  const description = getDescription(manga);

  // Generate pseudo-random rating based on manga id for display
  const rating = (4 + (parseInt(manga.id.slice(0, 8), 16) % 10) / 10).toFixed(1);
  const views = Math.floor((parseInt(manga.id.slice(8, 16), 16) % 9000) + 1000) * 1000;

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  if (variant === 'compact') {
    return (
      <Link
        to={`/manga/${manga.id}`}
        className="group relative flex gap-4 overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-card/80 to-card/40 p-4 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 transition-all duration-500 group-hover:opacity-100" />
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:bg-primary/20" />
        
        <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {parseFloat(rating) >= 4.5 && (
            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent to-orange-600 shadow-lg">
              <Flame className="h-3 w-3 text-accent-foreground" />
            </div>
          )}
        </div>
        
        <div className="relative flex flex-1 flex-col justify-center">
          <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{latestChapter ? `Chapter ${latestChapter}` : `${chaptersCount} Chapters`}</span>
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-accent">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{lastUpdated}</span>
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
        'group relative overflow-hidden rounded-2xl transition-all duration-500',
        'hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/10',
        variant === 'featured' && 'md:flex md:h-80'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-60" />
      
      <div className={cn(
        'relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card',
        variant === 'featured' && 'md:flex'
      )}>
        <div
          className={cn(
            'relative overflow-hidden',
            variant === 'featured' ? 'h-56 md:h-full md:w-52 md:flex-shrink-0' : 'aspect-[3/4]'
          )}
        >
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 transition-all duration-500 group-hover:opacity-100" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          
          <Badge
            className={cn(
              'absolute right-3 top-3 border-0 text-xs font-bold uppercase tracking-wide shadow-lg',
              status === 'completed' 
                ? 'bg-gradient-to-r from-accent to-orange-600 text-accent-foreground' 
                : 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground'
            )}
          >
            {status}
          </Badge>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-background/60 px-3 py-1.5 text-sm font-bold shadow-lg backdrop-blur-md">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-foreground">{rating}</span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-background/60 px-3 py-1.5 text-sm shadow-lg backdrop-blur-md">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-foreground">{formatViews(views)}</span>
          </div>
        </div>

        <div className={cn(
          'relative p-4',
          variant === 'featured' && 'md:flex md:flex-1 md:flex-col md:justify-center md:p-6'
        )}>
          <h3 className="line-clamp-2 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {title}
          </h3>
          
          {variant === 'featured' && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {genres.slice(0, variant === 'featured' ? 4 : 2).map((genre) => (
              <Badge 
                key={genre} 
                variant="outline" 
                className="border-border/50 bg-secondary/30 text-xs capitalize backdrop-blur-sm transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10"
              >
                {genre}
              </Badge>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">{chaptersCount || '?'} Chapters</span>
            </div>
            {variant !== 'featured' && latestChapter && (
              <span className="rounded-full bg-secondary/50 px-2 py-0.5 text-xs font-medium">
                Ch. {latestChapter}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

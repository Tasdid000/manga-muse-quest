import { Link } from 'react-router-dom';
import { Play, Star, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import heroBanner from '@/assets/hero-banner.jpg';
import type { Manga } from '@/types/manga';

interface HeroBannerProps {
  manga: Manga;
}

export function HeroBanner({ manga }: HeroBannerProps) {
  return (
    <section className="relative h-[500px] w-full overflow-hidden md:h-[600px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative flex h-full items-center">
        <div className="max-w-xl space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Featured
            </Badge>
            <Badge variant="outline" className="capitalize">
              {manga.status}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            {manga.title}
          </h1>

          <p className="line-clamp-3 text-lg text-muted-foreground">
            {manga.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{manga.rating}</span>
            </div>
            <span>•</span>
            <span>{manga.chapters.length} Chapters</span>
            <span>•</span>
            <span>By {manga.author}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to={`/manga/${manga.id}/chapter/${manga.chapters[manga.chapters.length - 1]?.id}`}>
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start Reading
              </Button>
            </Link>
            <Link to={`/manga/${manga.id}`}>
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="h-5 w-5" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

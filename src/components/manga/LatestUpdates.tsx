import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Zap } from 'lucide-react';
import { MangaCard } from './MangaCard';
import { Button } from '@/components/ui/button';
import type { Manga } from '@/types/manga';

interface LatestUpdatesProps {
  manga: Manga[];
}

export function LatestUpdates({ manga }: LatestUpdatesProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 shadow-lg">
            <Clock className="h-6 w-6 text-primary" />
            {/* Pulse indicator */}
            <span className="absolute -right-1 -top-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Latest Updates
            </h2>
            <p className="text-sm text-muted-foreground">Fresh chapters just released</p>
          </div>
        </div>
        <Link to="/latest">
          <Button 
            variant="ghost" 
            className="group gap-2 text-primary transition-all duration-300 hover:bg-primary/10"
          >
            View All
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {manga.map((m, index) => (
          <MangaCard key={m.id} manga={m} variant="compact" index={index} />
        ))}
      </div>
    </section>
  );
}
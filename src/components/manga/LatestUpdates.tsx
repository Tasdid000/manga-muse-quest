import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { MangaCard } from './MangaCard';
import type { Manga } from '@/types/manga';

interface LatestUpdatesProps {
  manga: Manga[];
}

export function LatestUpdates({ manga }: LatestUpdatesProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Latest Updates
          </h2>
        </div>
        <Link 
          to="/latest" 
          className="group flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {manga.map((m, index) => (
          <MangaCard key={m.id} manga={m} variant="compact" index={index} />
        ))}
      </div>
    </section>
  );
}

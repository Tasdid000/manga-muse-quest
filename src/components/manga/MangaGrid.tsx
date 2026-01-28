import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { MangaCard } from './MangaCard';
import { Button } from '@/components/ui/button';
import type { Manga } from '@/types/manga';

interface MangaGridProps {
  manga: Manga[];
  title?: string;
  showAll?: string;
}

export function MangaGrid({ manga, title, showAll }: MangaGridProps) {
  return (
    <section className="animate-fade-in">
      {(title || showAll) && (
        <div className="mb-8 flex items-center justify-between">
          {title && (
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {title}
            </h2>
          )}
          {showAll && (
            <Link to={showAll}>
              <Button 
                variant="ghost" 
                className="group gap-2 text-primary transition-all duration-300 hover:bg-primary/10"
              >
                View All
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
        {manga.map((m, index) => (
          <MangaCard key={m.id} manga={m} index={index} />
        ))}
      </div>
    </section>
  );
}
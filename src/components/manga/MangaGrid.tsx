import { MangaCard } from './MangaCard';
import type { Manga } from '@/types/manga';

interface MangaGridProps {
  manga: Manga[];
  title?: string;
  showAll?: string;
}

export function MangaGrid({ manga, title, showAll }: MangaGridProps) {
  return (
    <section>
      {(title || showAll) && (
        <div className="mb-6 flex items-center justify-between">
          {title && <h2 className="text-2xl font-bold text-foreground">{title}</h2>}
          {showAll && (
            <a href={showAll} className="text-sm font-medium text-primary hover:underline">
              View All →
            </a>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {manga.map((m) => (
          <MangaCard key={m.id} manga={m} />
        ))}
      </div>
    </section>
  );
}

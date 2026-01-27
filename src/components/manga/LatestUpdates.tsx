import { MangaCard } from './MangaCard';
import type { Manga } from '@/types/manga';

interface LatestUpdatesProps {
  manga: Manga[];
}

export function LatestUpdates({ manga }: LatestUpdatesProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Latest Updates</h2>
        <a href="/latest" className="text-sm font-medium text-primary hover:underline">
          View All →
        </a>
      </div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {manga.map((m) => (
          <MangaCard key={m.id} manga={m} variant="compact" />
        ))}
      </div>
    </section>
  );
}

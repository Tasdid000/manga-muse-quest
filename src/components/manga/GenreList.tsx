import { Link } from 'react-router-dom';
import { 
  Sword, Heart, Sparkles, Laugh, Theater, Ghost, 
  Rocket, Coffee, Trophy, Wand2, Skull, Flame 
} from 'lucide-react';
import type { Genre } from '@/types/manga';

const genreIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  action: Sword,
  adventure: Flame,
  comedy: Laugh,
  drama: Theater,
  fantasy: Wand2,
  horror: Ghost,
  romance: Heart,
  'sci-fi': Rocket,
  'slice-of-life': Coffee,
  sports: Trophy,
  supernatural: Sparkles,
  thriller: Skull,
};

interface GenreListProps {
  genres: Genre[];
}

export function GenreList({ genres }: GenreListProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-foreground">Browse by Genre</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
        {genres.map((genre) => {
          const Icon = genreIcons[genre.id] || Sparkles;
          return (
            <Link
              key={genre.id}
              to={`/genres/${genre.id}`}
              className="group flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-center transition-all hover:bg-primary hover:shadow-md"
            >
              <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              <span className="text-xs font-medium text-foreground group-hover:text-primary-foreground">
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

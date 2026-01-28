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

const genreColors: Record<string, string> = {
  action: 'from-red-500/20 to-orange-500/20 hover:from-red-500 hover:to-orange-500',
  adventure: 'from-amber-500/20 to-yellow-500/20 hover:from-amber-500 hover:to-yellow-500',
  comedy: 'from-yellow-400/20 to-lime-400/20 hover:from-yellow-400 hover:to-lime-400',
  drama: 'from-purple-500/20 to-pink-500/20 hover:from-purple-500 hover:to-pink-500',
  fantasy: 'from-violet-500/20 to-indigo-500/20 hover:from-violet-500 hover:to-indigo-500',
  horror: 'from-gray-600/20 to-slate-700/20 hover:from-gray-600 hover:to-slate-700',
  romance: 'from-pink-500/20 to-rose-500/20 hover:from-pink-500 hover:to-rose-500',
  'sci-fi': 'from-cyan-500/20 to-blue-500/20 hover:from-cyan-500 hover:to-blue-500',
  'slice-of-life': 'from-emerald-500/20 to-teal-500/20 hover:from-emerald-500 hover:to-teal-500',
  sports: 'from-green-500/20 to-emerald-500/20 hover:from-green-500 hover:to-emerald-500',
  supernatural: 'from-indigo-500/20 to-purple-500/20 hover:from-indigo-500 hover:to-purple-500',
  thriller: 'from-slate-600/20 to-gray-600/20 hover:from-slate-600 hover:to-gray-600',
};

interface GenreListProps {
  genres: Genre[];
}

export function GenreList({ genres }: GenreListProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Browse by Genre
        </h2>
        <Link 
          to="/genres" 
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
        {genres.map((genre, index) => {
          const Icon = genreIcons[genre.id] || Sparkles;
          const colorClass = genreColors[genre.id] || 'from-primary/20 to-accent/20 hover:from-primary hover:to-accent';
          
          return (
            <Link
              key={genre.id}
              to={`/genres/${genre.id}`}
              className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br ${colorClass} p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              
              <div className="relative rounded-lg bg-background/50 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-background/80">
                <Icon className="h-5 w-5 text-foreground transition-colors" />
              </div>
              <span className="relative text-xs font-semibold text-foreground transition-colors group-hover:text-primary-foreground">
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

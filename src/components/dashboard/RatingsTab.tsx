import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface RatingItem {
  id: string;
  manga_id: string;
  manga_title: string;
  cover_url: string | null;
  rating: number;
  created_at: string;
}

export default function RatingsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ratings, isLoading } = useQuery({
    queryKey: ['ratings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RatingItem[];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (ratingId: string) => {
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Rating removed' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to remove rating' });
    },
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-500/20 text-green-500 border-green-500/30';
    if (rating >= 6) return 'bg-accent/20 text-accent border-accent/30';
    if (rating >= 4) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    return 'bg-red-500/20 text-red-500 border-red-500/30';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(rating / 2);
          const half = i === Math.floor(rating / 2) && rating % 2 !== 0;
          return (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                filled ? 'fill-accent text-accent' : half ? 'fill-accent/50 text-accent' : 'text-muted-foreground/30'
              }`}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!ratings?.length) {
    return (
      <Card className="border-border/30 bg-gradient-to-br from-card to-accent/5 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl" />
            <div className="relative h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
              <Star className="h-12 w-12 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">No Ratings Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Rate manga to keep track of your opinions and help others find great reads!
          </p>
          <Button asChild size="lg" className="rounded-xl px-8">
            <Link to="/browse">Browse Manga</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {ratings.map((rating, index) => (
        <Card 
          key={rating.id} 
          className="group overflow-hidden border-border/30 bg-card hover:border-accent/30 transition-all duration-300 rounded-2xl animate-fade-in"
          style={{ animationDelay: `${index * 0.03}s` }}
        >
          <div className="relative aspect-[3/4]">
            <img
              src={rating.cover_url || '/placeholder.svg'}
              alt={rating.manga_title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Rating Badge */}
            <Badge className={`absolute top-3 right-3 ${getRatingColor(rating.rating)} font-bold text-sm px-2.5 py-1`}>
              {rating.rating}/10
            </Badge>
            
            {/* Hover Actions */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1 rounded-xl h-10">
                  <Link to={`/manga/${rating.manga_id}`}>
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    View
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-10 w-10 p-0 rounded-xl"
                  onClick={() => deleteMutation.mutate(rating.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
              {rating.manga_title}
            </h3>
            {renderStars(rating.rating)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

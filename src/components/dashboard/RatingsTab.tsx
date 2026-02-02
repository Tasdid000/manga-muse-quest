import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
      toast({ title: 'Rating removed' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to remove rating' });
    },
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-foreground">{rating}/10</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!ratings?.length) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Star className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Ratings Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Rate manga to keep track of your opinions and help others find great reads!
          </p>
          <Button asChild className="mt-4">
            <Link to="/browse">Browse Manga</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {ratings.map((rating) => (
        <Card key={rating.id} className="group overflow-hidden bg-card hover:shadow-lg transition-shadow">
          <div className="relative aspect-[3/4]">
            <img
              src={rating.cover_url || '/placeholder.svg'}
              alt={rating.manga_title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1">
                  <Link to={`/manga/${rating.manga_id}`}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(rating.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-xs font-bold text-foreground">{rating.rating}/10</span>
            </div>
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm text-foreground line-clamp-2">{rating.manga_title}</h3>
            <div className="mt-2">
              {renderStars(rating.rating)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface BookmarkItem {
  id: string;
  manga_id: string;
  manga_title: string;
  cover_url: string | null;
  created_at: string;
}

export default function BookmarksTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BookmarkItem[];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Bookmark removed' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to remove bookmark' });
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!bookmarks?.length) {
    return (
      <Card className="border-border/30 bg-gradient-to-br from-card to-secondary/10 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
            <div className="relative h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Bookmark className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">No Bookmarks Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Start bookmarking your favorite manga to keep track of what you want to read!
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
      {bookmarks.map((bookmark, index) => (
        <Card 
          key={bookmark.id} 
          className="group overflow-hidden border-border/30 bg-card hover:border-primary/30 transition-all duration-300 rounded-2xl animate-fade-in"
          style={{ animationDelay: `${index * 0.03}s` }}
        >
          <div className="relative aspect-[3/4]">
            <img
              src={bookmark.cover_url || '/placeholder.svg'}
              alt={bookmark.manga_title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Hover Actions */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1 rounded-xl h-10">
                  <Link to={`/manga/${bookmark.manga_id}`}>
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    View
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-10 w-10 p-0 rounded-xl"
                  onClick={() => deleteMutation.mutate(bookmark.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {bookmark.manga_title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(bookmark.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

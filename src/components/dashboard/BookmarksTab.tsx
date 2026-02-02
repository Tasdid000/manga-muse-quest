import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
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
      toast({ title: 'Bookmark removed' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to remove bookmark' });
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!bookmarks?.length) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Bookmarks Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Start bookmarking your favorite manga to keep track of what you want to read!
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
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="group overflow-hidden bg-card hover:shadow-lg transition-shadow">
          <div className="relative aspect-[3/4]">
            <img
              src={bookmark.cover_url || '/placeholder.svg'}
              alt={bookmark.manga_title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1">
                  <Link to={`/manga/${bookmark.manga_id}`}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(bookmark.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm text-foreground line-clamp-2">{bookmark.manga_title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Added {new Date(bookmark.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

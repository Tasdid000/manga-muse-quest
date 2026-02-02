import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Heart, Trash2, ExternalLink, Bell, BellOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface FollowingItem {
  id: string;
  manga_id: string;
  manga_title: string;
  cover_url: string | null;
  notify_updates: boolean;
  created_at: string;
}

export default function FollowingTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: following, isLoading } = useQuery({
    queryKey: ['following', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('following')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FollowingItem[];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (followingId: string) => {
      const { error } = await supabase
        .from('following')
        .delete()
        .eq('id', followingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast({ title: 'Unfollowed' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to unfollow' });
    },
  });

  const toggleNotifyMutation = useMutation({
    mutationFn: async ({ id, notify }: { id: string; notify: boolean }) => {
      const { error } = await supabase
        .from('following')
        .update({ notify_updates: notify })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to update notification settings' });
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

  if (!following?.length) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Not Following Any Manga</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Follow manga to get notified when new chapters are released!
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
      {following.map((item) => (
        <Card key={item.id} className="group overflow-hidden bg-card hover:shadow-lg transition-shadow">
          <div className="relative aspect-[3/4]">
            <img
              src={item.cover_url || '/placeholder.svg'}
              alt={item.manga_title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1">
                  <Link to={`/manga/${item.manga_id}`}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5">
              {item.notify_updates ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm text-foreground line-clamp-2">{item.manga_title}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Notifications</span>
              <Switch
                checked={item.notify_updates}
                onCheckedChange={(checked) =>
                  toggleNotifyMutation.mutate({ id: item.id, notify: checked })
                }
                disabled={toggleNotifyMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

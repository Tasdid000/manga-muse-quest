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
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!following?.length) {
    return (
      <Card className="border-border/30 bg-gradient-to-br from-card to-red-500/5 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />
            <div className="relative h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Not Following Any Manga</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Follow manga to get notified when new chapters are released!
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
      {following.map((item, index) => (
        <Card 
          key={item.id} 
          className="group overflow-hidden border-border/30 bg-card hover:border-red-500/30 transition-all duration-300 rounded-2xl animate-fade-in"
          style={{ animationDelay: `${index * 0.03}s` }}
        >
          <div className="relative aspect-[3/4]">
            <img
              src={item.cover_url || '/placeholder.svg'}
              alt={item.manga_title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Notification Badge */}
            <div className={`absolute top-3 right-3 rounded-full p-2 transition-all ${
              item.notify_updates 
                ? 'bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30' 
                : 'bg-background/80 text-muted-foreground backdrop-blur-sm'
            }`}>
              {item.notify_updates ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </div>
            
            {/* Hover Actions */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1 rounded-xl h-10">
                  <Link to={`/manga/${item.manga_id}`}>
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    View
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-10 w-10 p-0 rounded-xl"
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-3 group-hover:text-red-500 transition-colors">
              {item.manga_title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Notifications</span>
              <Switch
                checked={item.notify_updates}
                onCheckedChange={(checked) =>
                  toggleNotifyMutation.mutate({ id: item.id, notify: checked })
                }
                disabled={toggleNotifyMutation.isPending}
                className="scale-90"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

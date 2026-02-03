import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Bookmark, Star, Heart } from 'lucide-react';

export function DashboardHeader() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      const [bookmarks, ratings, following] = await Promise.all([
        supabase.from('bookmarks').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('ratings').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('following').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
      ]);
      return {
        bookmarks: bookmarks.count || 0,
        ratings: ratings.count || 0,
        following: following.count || 0,
      };
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-gradient-to-br from-card via-card/95 to-secondary/20 p-8 mb-8">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-50 blur-sm" />
          <Avatar className="relative h-24 w-24 border-4 border-background">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {profile?.username?.[0]?.toUpperCase() || <User className="h-10 w-10" />}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {profile?.username || 'Welcome Back!'}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm bg-primary/10 border-primary/20 hover:bg-primary/20">
              <Bookmark className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">{stats?.bookmarks || 0}</span>
              <span className="text-muted-foreground">Bookmarks</span>
            </Badge>
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm bg-accent/10 border-accent/20 hover:bg-accent/20">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-semibold text-foreground">{stats?.ratings || 0}</span>
              <span className="text-muted-foreground">Ratings</span>
            </Badge>
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm bg-red-500/10 border-red-500/20 hover:bg-red-500/20">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-foreground">{stats?.following || 0}</span>
              <span className="text-muted-foreground">Following</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

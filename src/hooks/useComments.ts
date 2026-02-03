import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  user_id: string;
  manga_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export function useComments(mangaId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', mangaId],
    queryFn: async () => {
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('manga_id', mangaId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      if (!commentsData?.length) return [];

      // Fetch profiles separately
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return commentsData.map(comment => ({
        ...comment,
        profile: profileMap.get(comment.user_id) || { username: null, avatar_url: null }
      })) as Comment[];
    },
    enabled: !!mangaId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          manga_id: mangaId,
          content: content.trim(),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', mangaId] });
      toast({ title: 'Comment posted!' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to post comment' });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', mangaId] });
      toast({ title: 'Comment deleted' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to delete comment' });
    },
  });

  return {
    comments,
    isLoading,
    addComment: addCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    isAdding: addCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending,
  };
}

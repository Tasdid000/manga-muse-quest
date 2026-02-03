import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useComments } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Loader2, MessageSquare, Trash2, User, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface CommentsSectionProps {
  mangaId: string;
}

export function CommentsSection({ mangaId }: CommentsSectionProps) {
  const { user } = useAuth();
  const { comments, isLoading, addComment, deleteComment, isAdding, isDeleting } = useComments(mangaId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(newComment, {
      onSuccess: () => setNewComment(''),
    });
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user ? (
        <Card className="border-border/30 bg-card/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Share your thoughts about this manga..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none border-border/50 bg-background/50 focus:border-primary"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {newComment.length}/1000 characters
                  </span>
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isAdding}
                    className="gap-2"
                  >
                    {isAdding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="border-border/30 bg-card/50 p-8 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-foreground font-medium mb-2">Join the conversation</p>
          <p className="text-muted-foreground text-sm mb-4">
            Sign in to share your thoughts about this manga
          </p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </Card>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
          
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <Card
                key={comment.id}
                className="border-border/30 bg-card/50 p-5 transition-all hover:border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 border-2 border-border/30">
                    <AvatarImage src={comment.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-secondary text-muted-foreground">
                      {comment.profile?.username?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {comment.profile?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      {user?.id === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteComment(comment.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-foreground/90 whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground">No comments yet</p>
          <p className="text-muted-foreground">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}

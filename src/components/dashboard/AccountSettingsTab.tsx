import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, LogOut, Edit3, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountSettingsTab() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;
      setUsername(data.username || '');
      return data;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (newUsername: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: 'Profile updated successfully' });
      setIsEditing(false);
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to update profile' });
    },
  });

  const handleLogout = async () => {
    await signOut();
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Information Card */}
      <Card className="border-border/30 bg-gradient-to-br from-card to-primary/5 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            Profile Information
          </CardTitle>
          <CardDescription>Update your account profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="username" className="text-sm font-medium">Username</Label>
            {isEditing ? (
              <div className="flex gap-3">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="flex-1 h-11 rounded-xl border-border/50 focus:border-primary"
                />
                <Button
                  onClick={() => updateProfileMutation.mutate(username)}
                  disabled={updateProfileMutation.isPending}
                  className="h-11 px-4 rounded-xl"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setUsername(profile?.username || '');
                  }}
                  className="h-11 px-4 rounded-xl border-border/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/30">
                <span className="flex-1 text-foreground font-medium">
                  {profile?.username || 'Not set'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="h-9 px-4 rounded-lg hover:bg-primary/10 hover:text-primary"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Card */}
      <Card className="border-border/30 bg-gradient-to-br from-card to-secondary/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            Email Address
          </CardTitle>
          <CardDescription>Your account email address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
            <p className="text-foreground font-medium">{user?.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Email changes are not supported at this time
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions Card */}
      <Card className="border-border/30 bg-gradient-to-br from-card to-destructive/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator className="bg-border/30" />
          <div className="pt-2">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="rounded-xl h-11 px-6"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

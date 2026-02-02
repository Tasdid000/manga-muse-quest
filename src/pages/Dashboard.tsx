import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, Star, Heart, Settings, Loader2 } from 'lucide-react';
import BookmarksTab from '@/components/dashboard/BookmarksTab';
import RatingsTab from '@/components/dashboard/RatingsTab';
import FollowingTab from '@/components/dashboard/FollowingTab';
import AccountSettingsTab from '@/components/dashboard/AccountSettingsTab';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
        </div>

        <Tabs defaultValue="bookmarks" className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 p-1 mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="bookmarks" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Bookmarks</span>
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Ratings</span>
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Following</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Account Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks">
            <BookmarksTab />
          </TabsContent>

          <TabsContent value="ratings">
            <RatingsTab />
          </TabsContent>

          <TabsContent value="following">
            <FollowingTab />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

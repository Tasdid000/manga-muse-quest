import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, Star, Heart, Settings } from 'lucide-react';
import BookmarksTab from './BookmarksTab';
import RatingsTab from './RatingsTab';
import FollowingTab from './FollowingTab';
import AccountSettingsTab from './AccountSettingsTab';

export function DashboardTabs() {
  return (
    <Tabs defaultValue="bookmarks" className="w-full">
      <TabsList className="w-full h-auto justify-start bg-card/50 border border-border/30 p-2 mb-8 flex-wrap gap-2 rounded-2xl">
        <TabsTrigger 
          value="bookmarks" 
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
        >
          <Bookmark className="h-4 w-4" />
          <span>Bookmarks</span>
        </TabsTrigger>
        <TabsTrigger 
          value="ratings" 
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-accent/20"
        >
          <Star className="h-4 w-4" />
          <span>Ratings</span>
        </TabsTrigger>
        <TabsTrigger 
          value="following" 
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/20"
        >
          <Heart className="h-4 w-4" />
          <span>Following</span>
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-lg"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bookmarks" className="mt-0 animate-fade-in">
        <BookmarksTab />
      </TabsContent>

      <TabsContent value="ratings" className="mt-0 animate-fade-in">
        <RatingsTab />
      </TabsContent>

      <TabsContent value="following" className="mt-0 animate-fade-in">
        <FollowingTab />
      </TabsContent>

      <TabsContent value="settings" className="mt-0 animate-fade-in">
        <AccountSettingsTab />
      </TabsContent>
    </Tabs>
  );
}

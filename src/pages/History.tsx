import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { History as HistoryIcon, BookOpen, Play, Trash2, Clock, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const History = () => {
  const [isDark, setIsDark] = useState(true);
  const { history, removeEntry, clearHistory } = useReadingHistory();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="container py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 shadow-lg">
              <HistoryIcon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Reading History
              </h1>
              <p className="text-muted-foreground">
                {history.length} {history.length === 1 ? 'manga' : 'manga'} in history
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all reading history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your entire reading history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={clearHistory}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/30 bg-card/50 px-6 py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No reading history yet</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Start reading some manga and your progress will be saved here automatically.
            </p>
            <Link to="/browse">
              <Button className="mt-6 gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Manga
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.map((entry, index) => (
              <div
                key={entry.mangaId}
                className="group relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-card/80 to-card/40 p-4 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 transition-all duration-500 group-hover:opacity-100" />
                
                <div className="relative flex gap-4">
                  <Link 
                    to={`/manga/${entry.mangaId}`}
                    className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  >
                    <img
                      src={entry.coverUrl}
                      alt={entry.mangaTitle}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                  
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <Link to={`/manga/${entry.mangaId}`}>
                        <h3 className="line-clamp-2 text-base font-bold text-foreground transition-colors duration-300 hover:text-primary">
                          {entry.mangaTitle}
                        </h3>
                      </Link>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Chapter {entry.chapterNumber}</span>
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(entry.lastReadAt)}</span>
                      </p>
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                            style={{ width: `${((entry.pageNumber + 1) / entry.totalPages) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {entry.pageNumber + 1}/{entry.totalPages}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative mt-4 flex items-center gap-2">
                  <Link to={`/manga/${entry.mangaId}/chapter/${entry.chapterId}`} className="flex-1">
                    <Button className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 font-medium shadow-lg transition-all hover:shadow-xl">
                      <Play className="h-4 w-4 fill-current" />
                      Continue Reading
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl border-border/50 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove from history?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove "{entry.mangaTitle}" from your reading history.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => removeEntry(entry.mangaId)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default History;
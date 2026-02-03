import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Eye, Clock, BookOpen, Heart, Share2, Play, ChevronRight, Users, Calendar, Loader2, RotateCcw, MessageSquare } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useManga, useMangaChapters } from '@/hooks/useManhwa';
import { getTitle, getCoverUrl, getDescription, getGenres, mapStatus, getAuthorName, getArtistName } from '@/lib/api/mangadex';
import { useFavorites } from '@/hooks/useFavorites';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { CommentsSection } from '@/components/manga/CommentsSection';

const MangaDetail = () => {
  const { mangaId } = useParams();
  const [isDark, setIsDark] = useState(true);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getProgress } = useReadingHistory();

  const { data: mangaData, isLoading: mangaLoading, error: mangaError } = useManga(mangaId || '');
  const { data: chaptersData, isLoading: chaptersLoading } = useMangaChapters(mangaId || '', 500);

  const readingProgress = mangaId ? getProgress(mangaId) : undefined;

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  if (mangaLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <div className="container py-12">
          <div className="flex flex-col gap-10 lg:flex-row">
            <Skeleton className="mx-auto h-[400px] w-[280px] rounded-2xl lg:mx-0 md:h-[450px] md:w-[300px]" />
            <div className="flex-1 space-y-6">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
              <Skeleton className="h-12 w-3/4" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (mangaError || !mangaData?.data) {
    return (
      <div className="min-h-screen bg-background">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <div className="container flex h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-6xl">📚</p>
            <p className="mt-4 text-xl font-medium text-foreground">Manga not found</p>
            <p className="mt-2 text-muted-foreground">The manga you're looking for doesn't exist.</p>
            <Link to="/">
              <Button className="mt-6">Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const manga = mangaData.data;
  const title = getTitle(manga);
  const cover = getCoverUrl(manga, 'large');
  const description = getDescription(manga);
  const genres = getGenres(manga);
  const status = mapStatus(manga.attributes.status);
  const author = getAuthorName(manga);
  const artist = getArtistName(manga);

  // Generate pseudo stats (ensure positive values)
  const rating = (4 + (parseInt(manga.id.slice(0, 8), 16) % 10) / 10).toFixed(1);
  const viewsHash = Math.abs(parseInt(manga.id.replace(/-/g, '').slice(0, 8), 16));
  const views = ((viewsHash % 9000) + 1000) * 1000;

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  // Process chapters - filter unique chapters and sort
  const chapters = chaptersData?.data
    ?.filter((ch, index, arr) => 
      arr.findIndex(c => c.attributes.chapter === ch.attributes.chapter) === index
    )
    .sort((a, b) => {
      const aNum = parseFloat(a.attributes.chapter || '0');
      const bNum = parseFloat(b.attributes.chapter || '0');
      return bNum - aNum;
    }) || [];

  const firstChapter = chapters[chapters.length - 1];
  const latestChapter = chapters[0];

  return (
    <div className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-xl"
            style={{ backgroundImage: `url(${cover})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          </div>

          <div className="absolute right-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[20%] left-[20%] h-48 w-48 rounded-full bg-accent/15 blur-[80px]" />

          <div className="container relative py-12 md:py-16">
            <div className="flex flex-col gap-10 lg:flex-row">
              {/* Cover */}
              <div className="flex-shrink-0 animate-fade-in">
                <div className="group relative mx-auto w-fit lg:mx-0">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 opacity-50 blur-lg transition-opacity duration-500 group-hover:opacity-80" />
                  
                  <img
                    src={cover}
                    alt={title}
                    className="relative h-[400px] w-[280px] rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] md:h-[450px] md:w-[300px]"
                  />
                  
                  <Badge
                    className={`absolute left-4 top-4 border-0 text-sm font-bold uppercase tracking-wide ${
                      status === 'completed' 
                        ? 'bg-gradient-to-r from-accent to-orange-600 text-accent-foreground' 
                        : 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground'
                    }`}
                  >
                    {status}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="outline" 
                      className="border-border/50 bg-secondary/50 px-4 py-1.5 text-sm capitalize backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-primary/10"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-4xl font-black leading-tight text-foreground md:text-5xl lg:text-6xl">
                  {title}
                </h1>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-4">
                    <div className="flex items-center gap-2 text-accent">
                      <Star className="h-5 w-5 fill-accent" />
                      <span className="text-2xl font-black text-foreground">{rating}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Eye className="h-5 w-5" />
                      <span className="text-2xl font-black text-foreground">{formatViews(views)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-secondary/50 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <span className="text-2xl font-black text-foreground">{chapters.length || '?'}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Chapters</p>
                  </div>
                  <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-secondary/50 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-bold text-foreground">
                        {manga.attributes.year || 'N/A'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Year</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Author:</span>
                    <span className="font-semibold text-foreground">{author}</span>
                  </div>
                  {artist && artist !== author && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Artist:</span>
                      <span className="font-semibold text-foreground">{artist}</span>
                    </div>
                  )}
                </div>

                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {description}
                </p>

                <div className="flex flex-wrap gap-4">
                  {/* Continue Reading Button */}
                  {readingProgress && (
                    <Link to={`/manga/${manga.id}/chapter/${readingProgress.chapterId}`}>
                      <Button 
                        size="lg" 
                        className="group h-14 gap-3 rounded-xl bg-gradient-to-r from-accent via-orange-600 to-accent bg-[length:200%_100%] px-8 text-lg font-bold shadow-xl shadow-accent/30 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-2xl"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-foreground/20 transition-transform group-hover:scale-110">
                          <RotateCcw className="h-4 w-4" />
                        </div>
                        Continue Ch. {readingProgress.chapterNumber}
                      </Button>
                    </Link>
                  )}
                  {firstChapter && !readingProgress && (
                    <Link to={`/manga/${manga.id}/chapter/${firstChapter.id}`}>
                      <Button 
                        size="lg" 
                        className="group h-14 gap-3 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] px-8 text-lg font-bold shadow-xl shadow-primary/30 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-2xl"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20 transition-transform group-hover:scale-110">
                          <Play className="h-4 w-4 fill-current" />
                        </div>
                        Start Reading
                      </Button>
                    </Link>
                  )}
                  {latestChapter && (
                    <Link to={`/manga/${manga.id}/chapter/${latestChapter.id}`}>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="h-14 gap-3 rounded-xl border-2 border-border/50 bg-background/30 px-6 text-lg font-bold backdrop-blur-md transition-all hover:border-primary hover:bg-primary/10"
                      >
                        <BookOpen className="h-5 w-5" />
                        Latest Ch. {latestChapter.attributes.chapter}
                      </Button>
                    </Link>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className={`h-14 w-14 rounded-xl border-2 transition-all ${
                      isFavorite(manga.id) 
                        ? 'border-red-500 bg-red-500/10 text-red-500' 
                        : 'border-border/50 hover:border-red-500 hover:bg-red-500/10 hover:text-red-500'
                    }`}
                    onClick={() => toggleFavorite({
                      mangaId: manga.id,
                      mangaTitle: title,
                      coverUrl: cover,
                    })}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite(manga.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-14 w-14 rounded-xl border-2 border-border/50 transition-all hover:border-primary hover:bg-primary/10"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters Section */}
        <section className="container py-12">
          <Tabs defaultValue="chapters" className="animate-fade-in">
            <TabsList className="mb-8 h-14 rounded-xl bg-secondary/50 p-1.5">
              <TabsTrigger 
                value="chapters" 
                className="h-full rounded-lg px-8 text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-lg"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Chapters
              </TabsTrigger>
              <TabsTrigger 
                value="comments" 
                className="h-full rounded-lg px-8 text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-lg"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="mt-0">
              {chaptersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : chapters.length === 0 ? (
                <div className="rounded-2xl border border-border/30 bg-card/50 p-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium text-foreground">No chapters available yet</p>
                  <p className="mt-2 text-muted-foreground">Check back later for updates.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {chapters.map((chapter, index) => (
                    <Link
                      key={chapter.id}
                      to={`/manga/${manga.id}/chapter/${chapter.id}`}
                      className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/50 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                            Chapter {chapter.attributes.chapter || '?'}
                          </p>
                          {chapter.attributes.title && (
                            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                              {chapter.attributes.title}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(chapter.attributes.publishAt).toLocaleDateString()}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments" className="mt-0">
              <CommentsSection mangaId={manga.id} />
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MangaDetail;

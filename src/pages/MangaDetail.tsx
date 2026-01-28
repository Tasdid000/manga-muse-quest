import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Eye, Clock, BookOpen, Heart, Share2, Play, ChevronRight, Sparkles, Users, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mangaList } from '@/data/mockData';

const MangaDetail = () => {
  const { mangaId } = useParams();
  const [isDark, setIsDark] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const manga = mangaList.find((m) => m.id === mangaId);

  if (!manga) {
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

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const firstChapter = manga.chapters[manga.chapters.length - 1];
  const latestChapter = manga.chapters[0];

  return (
    <div className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main>
        {/* Hero Section with Enhanced Design */}
        <section className="relative overflow-hidden">
          {/* Background with Blur and Gradient */}
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-xl"
            style={{ backgroundImage: `url(${manga.cover})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[20%] left-[20%] h-48 w-48 rounded-full bg-accent/15 blur-[80px]" />

          <div className="container relative py-12 md:py-16">
            <div className="flex flex-col gap-10 lg:flex-row">
              {/* Cover with Enhanced Styling */}
              <div className="flex-shrink-0 animate-fade-in">
                <div className="group relative mx-auto w-fit lg:mx-0">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 opacity-50 blur-lg transition-opacity duration-500 group-hover:opacity-80" />
                  
                  <img
                    src={manga.cover}
                    alt={manga.title}
                    className="relative h-[400px] w-[280px] rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] md:h-[450px] md:w-[300px]"
                  />
                  
                  {/* Status Badge */}
                  <Badge
                    className={`absolute left-4 top-4 border-0 text-sm font-bold uppercase tracking-wide ${
                      manga.status === 'completed' 
                        ? 'bg-gradient-to-r from-accent to-orange-600 text-accent-foreground' 
                        : 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground'
                    }`}
                  >
                    {manga.status}
                  </Badge>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="outline" 
                      className="border-border/50 bg-secondary/50 px-4 py-1.5 text-sm capitalize backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-primary/10"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-4xl font-black leading-tight text-foreground md:text-5xl lg:text-6xl">
                  {manga.title}
                </h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-4">
                    <div className="flex items-center gap-2 text-accent">
                      <Star className="h-5 w-5 fill-accent" />
                      <span className="text-2xl font-black text-foreground">{manga.rating}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Eye className="h-5 w-5" />
                      <span className="text-2xl font-black text-foreground">{formatViews(manga.views)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-secondary/50 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <span className="text-2xl font-black text-foreground">{manga.chapters.length}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Chapters</p>
                  </div>
                  <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-secondary/50 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-bold text-foreground">{manga.lastUpdated}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Updated</p>
                  </div>
                </div>

                {/* Author/Artist Info */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Author:</span>
                    <span className="font-semibold text-foreground">{manga.author}</span>
                  </div>
                  {manga.artist && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Artist:</span>
                      <span className="font-semibold text-foreground">{manga.artist}</span>
                    </div>
                  )}
                </div>

                {/* Synopsis */}
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {manga.synopsis}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link to={`/manga/${manga.id}/chapter/${firstChapter?.id}`}>
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
                  <Link to={`/manga/${manga.id}/chapter/${latestChapter?.id}`}>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-14 gap-3 rounded-xl border-2 border-border/50 bg-background/30 px-6 text-lg font-bold backdrop-blur-md transition-all hover:border-primary hover:bg-primary/10"
                    >
                      <BookOpen className="h-5 w-5" />
                      Latest Ch. {latestChapter?.number}
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className={`h-14 w-14 rounded-xl border-2 transition-all ${
                      isFavorite 
                        ? 'border-red-500 bg-red-500/10 text-red-500' 
                        : 'border-border/50 hover:border-red-500 hover:bg-red-500/10 hover:text-red-500'
                    }`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
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
                <Users className="mr-2 h-5 w-5" />
                Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="mt-0">
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {manga.chapters.map((chapter, index) => (
                  <Link
                    key={chapter.id}
                    to={`/manga/${manga.id}/chapter/${chapter.id}`}
                    className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/50 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                          Chapter {chapter.number}
                        </p>
                        {chapter.title !== `Chapter ${chapter.number}` && (
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{chapter.title}</p>
                        )}
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {chapter.releaseDate}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-0">
              <div className="rounded-2xl border border-border/30 bg-card/50 p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">Comments coming soon!</p>
                <p className="mt-2 text-muted-foreground">Be the first to share your thoughts.</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MangaDetail;
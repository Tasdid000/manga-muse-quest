import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Eye, Clock, BookOpen, Heart, Share2, Play } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mangaList } from '@/data/mockData';

const MangaDetail = () => {
  const { mangaId } = useParams();
  const [isDark, setIsDark] = useState(true);

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
          <p className="text-muted-foreground">Manga not found</p>
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
        {/* Hero Section */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm"
            style={{ backgroundImage: `url(${manga.cover})` }}
          >
            <div className="absolute inset-0 bg-background/90" />
          </div>

          <div className="container relative py-8">
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Cover */}
              <div className="flex-shrink-0">
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="mx-auto h-80 w-56 rounded-lg object-cover shadow-xl md:mx-0"
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="capitalize">
                    {manga.status}
                  </Badge>
                  {manga.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="capitalize">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                  {manga.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-medium">{manga.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatViews(manga.views)} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{manga.chapters.length} chapters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {manga.lastUpdated}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p><span className="text-foreground">Author:</span> {manga.author}</p>
                  {manga.artist && (
                    <p><span className="text-foreground">Artist:</span> {manga.artist}</p>
                  )}
                </div>

                <p className="text-muted-foreground">{manga.synopsis}</p>

                <div className="flex flex-wrap gap-3">
                  <Link to={`/manga/${manga.id}/chapter/${firstChapter?.id}`}>
                    <Button size="lg" className="gap-2">
                      <Play className="h-5 w-5" />
                      Start Reading
                    </Button>
                  </Link>
                  <Link to={`/manga/${manga.id}/chapter/${latestChapter?.id}`}>
                    <Button size="lg" variant="outline" className="gap-2">
                      <BookOpen className="h-5 w-5" />
                      Latest Ch. {latestChapter?.number}
                    </Button>
                  </Link>
                  <Button size="lg" variant="ghost" className="gap-2">
                    <Heart className="h-5 w-5" />
                    Favorite
                  </Button>
                  <Button size="lg" variant="ghost" className="gap-2">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters */}
        <section className="container py-8">
          <Tabs defaultValue="chapters">
            <TabsList>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="mt-6">
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {manga.chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    to={`/manga/${manga.id}/chapter/${chapter.id}`}
                    className="flex items-center justify-between rounded-lg bg-card p-4 transition-colors hover:bg-secondary"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        Chapter {chapter.number}
                      </p>
                      {chapter.title !== `Chapter ${chapter.number}` && (
                        <p className="text-sm text-muted-foreground">{chapter.title}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{chapter.releaseDate}</span>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <div className="rounded-lg bg-card p-8 text-center">
                <p className="text-muted-foreground">Comments coming soon!</p>
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

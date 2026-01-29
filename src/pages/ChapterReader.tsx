import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Home, Settings, 
  ZoomIn, ZoomOut, Maximize2, ArrowLeft, Layers, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useChapterPages, useMangaChapters, useManga } from '@/hooks/useManhwa';
import { getTitle } from '@/lib/api/mangadex';
import { cn } from '@/lib/utils';

const ChapterReader = () => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const { data: mangaData } = useManga(mangaId || '');
  const { data: chaptersData } = useMangaChapters(mangaId || '', 500);
  const { data: pages, isLoading: pagesLoading, error: pagesError } = useChapterPages(chapterId || '', dataSaver);

  const manga = mangaData?.data;
  const title = manga ? getTitle(manga) : 'Loading...';

  // Process chapters
  const chapters = chaptersData?.data
    ?.filter((ch, index, arr) => 
      arr.findIndex(c => c.attributes.chapter === ch.attributes.chapter) === index
    )
    .sort((a, b) => {
      const aNum = parseFloat(a.attributes.chapter || '0');
      const bNum = parseFloat(b.attributes.chapter || '0');
      return bNum - aNum;
    }) || [];

  const currentChapter = chapters.find(ch => ch.id === chapterId);
  const chapterIndex = chapters.findIndex(ch => ch.id === chapterId);
  const prevChapter = chapters[chapterIndex + 1];
  const nextChapter = chapters[chapterIndex - 1];

  const goToPage = useCallback((page: number) => {
    if (pages && page >= 0 && page < pages.length) {
      setCurrentPage(page);
      setImageLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    } else if (prevChapter) {
      navigate(`/manga/${mangaId}/chapter/${prevChapter.id}`);
    }
  }, [currentPage, goToPage, prevChapter, navigate, mangaId]);

  const goToNextPage = useCallback(() => {
    if (pages && currentPage < pages.length - 1) {
      goToPage(currentPage + 1);
    } else if (nextChapter) {
      navigate(`/manga/${mangaId}/chapter/${nextChapter.id}`);
    }
  }, [currentPage, pages, goToPage, nextChapter, navigate, mangaId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        goToNextPage();
      } else if (e.key === 'Escape') {
        setShowControls((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevPage, goToNextPage]);

  useEffect(() => {
    setCurrentPage(0);
    setImageLoading(true);
  }, [chapterId]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (pagesError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-6xl">📖</p>
          <p className="mt-4 text-xl font-medium text-foreground">Failed to load chapter</p>
          <p className="mt-2 text-muted-foreground">Please try again later.</p>
          <Link to={`/manga/${mangaId}`}>
            <Button className="mt-6">Back to Manga</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = pages ? ((currentPage + 1) / pages.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-secondary">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top Controls */}
      <header
        className={cn(
          'fixed left-0 right-0 top-1 z-50 transition-all duration-500',
          !showControls && '-translate-y-full opacity-0'
        )}
      >
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border/30 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link to={`/manga/${mangaId}`}>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="hidden sm:block">
                  <h1 className="line-clamp-1 font-bold text-foreground">{title}</h1>
                  <p className="text-xs text-muted-foreground">
                    Chapter {currentChapter?.attributes.chapter || '?'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Chapter Select */}
                <Select
                  value={chapterId}
                  onValueChange={(value) => navigate(`/manga/${mangaId}/chapter/${value}`)}
                >
                  <SelectTrigger className="h-10 w-28 rounded-xl border-border/50 bg-secondary/50 font-medium">
                    <Layers className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Ch." />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {chapters.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        Ch. {ch.attributes.chapter || '?'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Page Select */}
                {pages && pages.length > 0 && (
                  <Select
                    value={currentPage.toString()}
                    onValueChange={(value) => goToPage(parseInt(value))}
                  >
                    <SelectTrigger className="h-10 w-24 rounded-xl border-border/50 bg-secondary/50 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {pages.map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i + 1} / {pages.length}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Settings Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="border-border/50">
                    <SheetHeader>
                      <SheetTitle>Reader Settings</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground">Zoom Level</label>
                          <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold">{zoom}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl"
                            onClick={() => setZoom(Math.max(50, zoom - 10))}
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Slider
                            value={[zoom]}
                            onValueChange={([value]) => setZoom(value)}
                            min={50}
                            max={200}
                            step={10}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl"
                            onClick={() => setZoom(Math.min(200, zoom + 10))}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="data-saver">Data Saver</Label>
                          <p className="text-xs text-muted-foreground">Lower quality, faster loading</p>
                        </div>
                        <Switch
                          id="data-saver"
                          checked={dataSaver}
                          onCheckedChange={setDataSaver}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFullscreen}
                  className="h-10 w-10 rounded-xl hover:bg-secondary"
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>

                <Link to="/">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary">
                    <Home className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Reader Area */}
      <main
        className="flex min-h-screen items-center justify-center px-4 py-24"
        onClick={() => setShowControls((prev) => !prev)}
      >
        <div className="relative">
          {/* Navigation Zones */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevPage();
            }}
            className="absolute left-0 top-0 z-10 h-full w-1/3 cursor-pointer transition-colors hover:bg-primary/5"
            aria-label="Previous page"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextPage();
            }}
            className="absolute right-0 top-0 z-10 h-full w-1/3 cursor-pointer transition-colors hover:bg-primary/5"
            aria-label="Next page"
          />

          {/* Page Image */}
          <div className="relative">
            {(pagesLoading || imageLoading) && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-secondary">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {pages && pages[currentPage] && (
              <img
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className={cn(
                  "max-h-[85vh] rounded-2xl shadow-2xl transition-all duration-300",
                  imageLoading && "opacity-0"
                )}
                style={{ transform: `scale(${zoom / 100})` }}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer
        className={cn(
          'fixed bottom-4 left-0 right-0 z-50 transition-all duration-500',
          !showControls && 'translate-y-full opacity-0'
        )}
      >
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border/30 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={goToPrevPage}
                disabled={currentPage === 0 && !prevChapter}
                className="h-10 gap-2 rounded-xl px-4 font-medium hover:bg-secondary"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">
                  {currentPage === 0 && prevChapter ? `Ch. ${prevChapter.attributes.chapter}` : 'Prev'}
                </span>
              </Button>

              <div className="flex flex-1 items-center gap-4">
                {pages && (
                  <>
                    <Slider
                      value={[currentPage]}
                      onValueChange={([value]) => goToPage(value)}
                      max={pages.length - 1}
                      className="flex-1"
                    />
                    <span className="w-16 text-center text-sm font-bold text-foreground">
                      {currentPage + 1} / {pages.length}
                    </span>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                onClick={goToNextPage}
                disabled={pages ? currentPage === pages.length - 1 && !nextChapter : true}
                className="h-10 gap-2 rounded-xl px-4 font-medium hover:bg-secondary"
              >
                <span className="hidden sm:inline">
                  {pages && currentPage === pages.length - 1 && nextChapter 
                    ? `Ch. ${nextChapter.attributes.chapter}` 
                    : 'Next'}
                </span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChapterReader;

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Home, Settings, 
  ZoomIn, ZoomOut, Maximize2, ArrowLeft, BookOpen, Layers
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
import { mangaList } from '@/data/mockData';
import { cn } from '@/lib/utils';

const generatePages = (chapterNum: number) => {
  return Array.from({ length: 20 }, (_, i) => 
    `https://picsum.photos/seed/${chapterNum}-${i}/800/1200`
  );
};

const ChapterReader = () => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const manga = mangaList.find((m) => m.id === mangaId);
  const chapter = manga?.chapters.find((c) => c.id === chapterId);
  const chapterIndex = manga?.chapters.findIndex((c) => c.id === chapterId) ?? -1;

  const pages = chapter ? generatePages(chapter.number) : [];

  const prevChapter = manga?.chapters[chapterIndex + 1];
  const nextChapter = manga?.chapters[chapterIndex - 1];

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < pages.length) {
      setCurrentPage(page);
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pages.length]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    } else if (prevChapter) {
      navigate(`/manga/${mangaId}/chapter/${prevChapter.id}`);
    }
  }, [currentPage, goToPage, prevChapter, navigate, mangaId]);

  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      goToPage(currentPage + 1);
    } else if (nextChapter) {
      navigate(`/manga/${mangaId}/chapter/${nextChapter.id}`);
    }
  }, [currentPage, pages.length, goToPage, nextChapter, navigate, mangaId]);

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
    setIsLoading(true);
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

  if (!manga || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-6xl">📖</p>
          <p className="mt-4 text-xl font-medium text-foreground">Chapter not found</p>
          <Link to="/">
            <Button className="mt-6">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((currentPage + 1) / pages.length) * 100;

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
                  <h1 className="line-clamp-1 font-bold text-foreground">{manga.title}</h1>
                  <p className="text-xs text-muted-foreground">Chapter {chapter.number}</p>
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {manga.chapters.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        Ch. {ch.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Page Select */}
                <Select
                  value={currentPage.toString()}
                  onValueChange={(value) => goToPage(parseInt(value))}
                >
                  <SelectTrigger className="h-10 w-24 rounded-xl border-border/50 bg-secondary/50 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i + 1} / {pages.length}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-secondary">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
            <img
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="max-h-[85vh] rounded-2xl shadow-2xl transition-all duration-300"
              style={{ transform: `scale(${zoom / 100})` }}
              onLoad={() => setIsLoading(false)}
            />
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
                  {currentPage === 0 && prevChapter ? `Ch. ${prevChapter.number}` : 'Prev'}
                </span>
              </Button>

              <div className="flex flex-1 items-center gap-4">
                <Slider
                  value={[currentPage]}
                  onValueChange={([value]) => goToPage(value)}
                  max={pages.length - 1}
                  className="flex-1"
                />
                <span className="w-16 text-center text-sm font-bold text-foreground">
                  {currentPage + 1} / {pages.length}
                </span>
              </div>

              <Button
                variant="ghost"
                onClick={goToNextPage}
                disabled={currentPage === pages.length - 1 && !nextChapter}
                className="h-10 gap-2 rounded-xl px-4 font-medium hover:bg-secondary"
              >
                <span className="hidden sm:inline">
                  {currentPage === pages.length - 1 && nextChapter ? `Ch. ${nextChapter.number}` : 'Next'}
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
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Home, List, Settings, 
  ZoomIn, ZoomOut, Maximize2, ArrowLeft
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

// Generate placeholder manga pages
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

  const manga = mangaList.find((m) => m.id === mangaId);
  const chapter = manga?.chapters.find((c) => c.id === chapterId);
  const chapterIndex = manga?.chapters.findIndex((c) => c.id === chapterId) ?? -1;

  // Generate pages for this chapter
  const pages = chapter ? generatePages(chapter.number) : [];

  const prevChapter = manga?.chapters[chapterIndex + 1];
  const nextChapter = manga?.chapters[chapterIndex - 1];

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < pages.length) {
      setCurrentPage(page);
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

  // Keyboard navigation
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

  // Reset page when chapter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [chapterId]);

  // Dark mode for reading
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
        <p className="text-muted-foreground">Chapter not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Controls */}
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 bg-card/95 backdrop-blur transition-transform duration-300',
          !showControls && '-translate-y-full'
        )}
      >
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to={`/manga/${mangaId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="hidden sm:block">
              <h1 className="line-clamp-1 font-medium text-foreground">{manga.title}</h1>
              <p className="text-xs text-muted-foreground">Chapter {chapter.number}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Chapter Select */}
            <Select
              value={chapterId}
              onValueChange={(value) => navigate(`/manga/${mangaId}/chapter/${value}`)}
            >
              <SelectTrigger className="w-32">
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
              <SelectTrigger className="w-24">
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
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Reader Settings</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Zoom: {zoom}%</label>
                    <div className="flex items-center gap-2">
                      <ZoomOut className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[zoom]}
                        onValueChange={([value]) => setZoom(value)}
                        min={50}
                        max={200}
                        step={10}
                      />
                      <ZoomIn className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              <Maximize2 className="h-5 w-5" />
            </Button>

            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Reader Area */}
      <main
        className="flex min-h-screen items-center justify-center px-4 py-20"
        onClick={() => setShowControls((prev) => !prev)}
      >
        <div className="relative">
          {/* Navigation Zones */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevPage();
            }}
            className="absolute left-0 top-0 z-10 h-full w-1/3 cursor-pointer"
            aria-label="Previous page"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextPage();
            }}
            className="absolute right-0 top-0 z-10 h-full w-1/3 cursor-pointer"
            aria-label="Next page"
          />

          {/* Page Image */}
          <img
            src={pages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            className="max-h-[85vh] rounded-lg shadow-2xl transition-transform"
            style={{ transform: `scale(${zoom / 100})` }}
          />
        </div>
      </main>

      {/* Bottom Controls */}
      <footer
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur transition-transform duration-300',
          !showControls && 'translate-y-full'
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <Button
            variant="ghost"
            onClick={goToPrevPage}
            disabled={currentPage === 0 && !prevChapter}
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">
              {currentPage === 0 && prevChapter ? `Ch. ${prevChapter.number}` : 'Previous'}
            </span>
          </Button>

          <div className="flex items-center gap-4">
            <Slider
              value={[currentPage]}
              onValueChange={([value]) => goToPage(value)}
              max={pages.length - 1}
              className="w-32 sm:w-64"
            />
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {pages.length}
            </span>
          </div>

          <Button
            variant="ghost"
            onClick={goToNextPage}
            disabled={currentPage === pages.length - 1 && !nextChapter}
          >
            <span className="hidden sm:inline">
              {currentPage === pages.length - 1 && nextChapter ? `Ch. ${nextChapter.number}` : 'Next'}
            </span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChapterReader;

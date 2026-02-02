import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, BookOpen, Moon, Sun, History, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/genres', label: 'Genres' },
    { href: '/latest', label: 'Latest' },
    { href: '/popular', label: 'Popular' },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        isScrolled 
          ? 'border-b border-border/30 bg-background/80 shadow-lg shadow-background/20 backdrop-blur-xl' 
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-18 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary via-purple-600 to-primary shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/30">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-foreground/20 to-transparent" />
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-xl font-black text-transparent">
              MangaVerse
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
              Read • Explore • Enjoy
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="search"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-60 rounded-xl border-border/50 bg-secondary/50 pl-10 font-medium transition-all duration-300 placeholder:text-muted-foreground/70 focus:w-72 focus:border-primary/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
              />
            </div>
          </form>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden h-11 w-11 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-primary/20 hover:text-primary sm:flex"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/history" className="cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    Reading History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-11 w-11 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-primary/20 hover:text-primary sm:flex"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Link to="/history">
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-11 w-11 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-primary/20 hover:text-primary sm:flex"
            >
              <History className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative h-11 w-11 overflow-hidden rounded-xl text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground"
          >
            <Sun className={cn(
              'h-5 w-5 transition-all duration-500',
              isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
            )} />
            <Moon className={cn(
              'absolute h-5 w-5 transition-all duration-500',
              isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
            )} />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-xl md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className={cn(
              'h-5 w-5 transition-all duration-300',
              isMenuOpen && 'rotate-90 scale-0'
            )} />
            <X className={cn(
              'absolute h-5 w-5 transition-all duration-300',
              isMenuOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
            )} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute left-0 right-0 top-[72px] border-b border-border/30 bg-background/98 backdrop-blur-xl transition-all duration-500 md:hidden',
          isMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : 'pointer-events-none -translate-y-4 opacity-0'
        )}
      >
        <div className="container py-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl bg-secondary/50 pl-12 font-medium"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'rounded-xl px-4 py-3.5 text-base font-semibold transition-all duration-300',
                    isActive 
                      ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Auth Links for Mobile */}
            <div className="mt-4 pt-4 border-t border-border/30">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <User className="h-5 w-5" />
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <User className="h-5 w-5" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-primary hover:bg-primary/10"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
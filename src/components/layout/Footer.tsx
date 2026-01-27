import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">MangaVerse</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for reading manga online. Thousands of titles, updated daily.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/browse" className="hover:text-foreground">Browse All</Link></li>
              <li><Link to="/popular" className="hover:text-foreground">Popular</Link></li>
              <li><Link to="/latest" className="hover:text-foreground">Latest Updates</Link></li>
              <li><Link to="/genres" className="hover:text-foreground">Genres</Link></li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Popular Genres</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/genres/action" className="hover:text-foreground">Action</Link></li>
              <li><Link to="/genres/romance" className="hover:text-foreground">Romance</Link></li>
              <li><Link to="/genres/fantasy" className="hover:text-foreground">Fantasy</Link></li>
              <li><Link to="/genres/comedy" className="hover:text-foreground">Comedy</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/dmca" className="hover:text-foreground">DMCA</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 MangaVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

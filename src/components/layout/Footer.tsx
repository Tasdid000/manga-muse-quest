import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Heart, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    browse: [
      { label: 'Popular Manga', href: '/popular' },
      { label: 'Latest Updates', href: '/latest' },
      { label: 'All Genres', href: '/genres' },
      { label: 'Completed Series', href: '/browse?status=completed' },
    ],
    genres: [
      { label: 'Action', href: '/genres/action' },
      { label: 'Romance', href: '/genres/romance' },
      { label: 'Fantasy', href: '/genres/fantasy' },
      { label: 'Comedy', href: '/genres/comedy' },
    ],
    support: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/30 bg-gradient-to-b from-card/30 to-card/80">
      {/* Background Decorations */}
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-accent/5 blur-[100px]" />
      
      <div className="container relative py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-purple-600 to-primary shadow-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground">MangaVerse</span>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Read • Explore • Enjoy</p>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
              Your ultimate destination for manga. Discover thousands of titles across every genre, 
              from action-packed adventures to heartwarming romances.
            </p>
            
            {/* Social Links */}
            <div className="mt-8 flex gap-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Github, label: 'Github' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <a 
                  key={label}
                  href="#" 
                  aria-label={label}
                  className="group flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 bg-secondary/50 transition-all duration-300 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                >
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {[
            { title: 'Browse', links: footerLinks.browse },
            { title: 'Genres', links: footerLinks.genres },
            { title: 'Support', links: footerLinks.support },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/30 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} <span className="font-semibold text-foreground">MangaVerse</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            Made with 
            <Heart className="h-4 w-4 animate-pulse fill-red-500 text-red-500" /> 
            for manga lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
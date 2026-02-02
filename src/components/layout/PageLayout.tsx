import { useState, useEffect, ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

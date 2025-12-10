import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Heart, Moon, Sun } from 'lucide-react';
import { useAnimeStore } from '@/store/useAnimeStore';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/FilterBar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { favorites } = useAnimeStore();
  const { theme, setTheme } = useTheme();

  const isHome = location.pathname === '/';
  const isFavorites = location.pathname === '/favorites';

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground text-2xl font-bold">A</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Anime Explorer
                </span>
              </motion.div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link to="/">
                <Button
                  variant={isHome ? "default" : "ghost"}
                  size="default"
                  className={cn("gap-2", isHome && "shadow-lg")}
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>

              <Link to="/favorites">
                <Button
                  variant={isFavorites ? "default" : "ghost"}
                  size="default"
                  className={cn("gap-2 relative", isFavorites && "shadow-lg")}
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Favorites</span>
                  {favorites.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                    >
                      {favorites.length > 99 ? '99+' : favorites.length}
                    </motion.span>
                  )}
                </Button>
              </Link>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="ml-2"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar - Only show on home page */}
      {isHome && <FilterBar />}

      {/* Main Content */}
      <main className="min-h-[calc(100vh-12rem)]">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground text-sm space-y-2">
            <p>
              Built with React, TypeScript, Zustand & shadcn/ui.{' '}
              <a
                href="https://jikan.moe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Powered by Jikan API
              </a>
            </p>
            <p>
              &copy; {new Date().getFullYear()} Anime Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search } from 'lucide-react';
import { useAnimeStore } from '@/store/useAnimeStore';
import { animeApi } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const FilterBar = () => {
  const {
    genres,
    genresLoading,
    selectedGenre,
    searchQuery,
    setGenres,
    setGenresLoading,
    setSelectedGenre,
    setSearchQuery,
    resetFilters,
  } = useAnimeStore();

  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const fetchGenres = async () => {
      if (genres.length === 0) {
        try {
          setGenresLoading(true);
          const response = await animeApi.getGenres();
          setGenres(response.data);
        } catch (error) {
          console.error('Failed to fetch genres:', error);
        } finally {
          setGenresLoading(false);
        }
      }
    };

    fetchGenres();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch.trim());
  };

  const handleGenreClick = (genreId: number) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genreId);
      setSearchQuery(''); // Clear search when genre is selected
      setLocalSearch('');
    }
  };

  const handleClearFilters = () => {
    resetFilters();
    setLocalSearch('');
    setShowFilters(false);
  };

  const hasActiveFilters = selectedGenre !== null || searchQuery !== '';

  return (
    <div className="sticky top-[73px] z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        {/* Search Bar and Filter Toggle */}
        <div className="flex gap-3 items-center">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search anime..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {localSearch && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </form>

          {/* Filter Toggle Button */}
          <Button
            variant={hasActiveFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0">
                1
              </Badge>
            )}
          </Button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                variant="destructive"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Genre Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by Genre
                </h3>

                {genresLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading genres...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre.mal_id}
                        variant={selectedGenre === genre.mal_id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGenreClick(genre.mal_id)}
                        className={cn(
                          "rounded-full text-xs",
                          selectedGenre === genre.mal_id && "shadow-lg shadow-primary/20"
                        )}
                      >
                        {genre.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

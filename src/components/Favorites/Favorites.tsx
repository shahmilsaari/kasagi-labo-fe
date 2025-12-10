import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Inbox, TrendingUp, Calendar, ArrowUpDown, Trash2, Sparkles } from 'lucide-react';
import { useAnimeStore } from '@/store/useAnimeStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SortOption = 'recent' | 'oldest' | 'rating' | 'title';

export const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useAnimeStore();
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(null);

  // Sort favorites based on selected option
  const getSortedFavorites = () => {
    const sorted = [...favorites];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => b.addedAt - a.addedAt);
      case 'oldest':
        return sorted.sort((a, b) => a.addedAt - b.addedAt);
      case 'rating':
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const sortedFavorites = getSortedFavorites();

  // Calculate statistics
  const averageScore = favorites.length > 0
    ? favorites.reduce((acc, fav) => acc + (fav.score || 0), 0) / favorites.filter(f => f.score).length
    : 0;

  const handleRemoveFavorite = (e: React.MouseEvent, malId: number) => {
    e.stopPropagation();
    if (showRemoveConfirm === malId) {
      removeFavorite(malId);
      setShowRemoveConfirm(null);
    } else {
      setShowRemoveConfirm(malId);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowRemoveConfirm(null), 3000);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-2xl mx-auto border-dashed border-2">
            <CardHeader className="text-center pb-12 pt-12">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center relative">
                  <Inbox className="w-12 h-12 text-muted-foreground" />
                  <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-3">No Favorites Yet</CardTitle>
              <CardDescription className="text-base mb-8">
                Start exploring anime and add your favorites by clicking the heart icon!
                <br />
                <span className="text-xs mt-2 inline-block">
                  Your favorite anime will appear here for easy access.
                </span>
              </CardDescription>
              <div className="flex justify-center">
                <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Explore Anime
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Favorites
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {favorites.length} {favorites.length === 1 ? 'anime' : 'anime'} in your collection
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{favorites.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{averageScore.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {favorites.filter(f => (f.score || 0) >= 8).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Top Rated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {new Date(favorites[0]?.addedAt).toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                  <p className="text-xs text-muted-foreground">Latest</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpDown className="w-4 h-4" />
            <span className="font-medium">Sort by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
              className={cn(sortBy === 'recent' && 'shadow-lg shadow-primary/20')}
            >
              Recently Added
            </Button>
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rating')}
              className={cn(sortBy === 'rating' && 'shadow-lg shadow-primary/20')}
            >
              Highest Rated
            </Button>
            <Button
              variant={sortBy === 'title' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('title')}
              className={cn(sortBy === 'title' && 'shadow-lg shadow-primary/20')}
            >
              Title (A-Z)
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('oldest')}
              className={cn(sortBy === 'oldest' && 'shadow-lg shadow-primary/20')}
            >
              First Added
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {sortedFavorites.map((favorite, index) => (
          <motion.div
            key={favorite.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={() => navigate(`/anime/${favorite.mal_id}`)}
          >
            <Card className="overflow-hidden cursor-pointer group relative border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={favorite.image_url}
                  alt={favorite.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Remove Favorite Button */}
                <Button
                  size="icon"
                  variant={showRemoveConfirm === favorite.mal_id ? "destructive" : "secondary"}
                  onClick={(e) => handleRemoveFavorite(e, favorite.mal_id)}
                  className={cn(
                    "absolute top-2 right-2 z-10 shadow-lg backdrop-blur-sm transition-all",
                    showRemoveConfirm === favorite.mal_id
                      ? "scale-110 animate-pulse"
                      : "bg-destructive/90 hover:bg-destructive"
                  )}
                >
                  {showRemoveConfirm === favorite.mal_id ? (
                    <Trash2 className="w-4 h-4" />
                  ) : (
                    <Heart className="w-4 h-4 fill-current" />
                  )}
                </Button>

                {/* Score Badge */}
                {favorite.score && (
                  <Badge className="absolute bottom-2 left-2 bg-yellow-500/90 text-black hover:bg-yellow-500 backdrop-blur-sm border-none">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {favorite.score.toFixed(1)}
                  </Badge>
                )}

                {/* Recently Added Badge */}
                {Date.now() - favorite.addedAt < 24 * 60 * 60 * 1000 && (
                  <Badge className="absolute top-2 left-2 bg-green-500/90 text-white backdrop-blur-sm border-none text-xs">
                    New
                  </Badge>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem] text-sm leading-tight">
                  {favorite.title}
                </h3>

                {/* Date Added */}
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(favorite.addedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Helper Text for Remove */}
      {showRemoveConfirm !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="border-destructive bg-destructive/10 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-destructive" />
              <p className="text-sm text-foreground">
                Click again to remove from favorites
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

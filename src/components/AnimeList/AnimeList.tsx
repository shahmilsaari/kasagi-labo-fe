import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { AlertCircle, Inbox } from 'lucide-react';
import { AnimeCard } from '@/components/AnimeCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAnimeList } from '@/hooks/useAnimeList';

export const AnimeList = () => {
  const { animeList, loading, error, hasNextPage, loadMore } = useAnimeList();

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !loading) {
      loadMore();
    }
  }, [inView, hasNextPage, loading, loadMore]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-destructive">Error Loading Anime</CardTitle>
            <CardDescription className="text-destructive/80">{error}</CardDescription>
            <div className="pt-4">
              <Button
                onClick={() => window.location.reload()}
                variant="destructive"
              >
                Retry
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  if (loading && animeList.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  if (animeList.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <Inbox className="w-10 h-10 text-muted-foreground" />
              </div>
            </div>
            <CardTitle>No Anime Found</CardTitle>
            <CardDescription>
              Try adjusting your filters or search query to find what you're looking for.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">All Anime</h2>

      {/* Anime Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {animeList.map((anime, index) => (
          <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} index={index} />
        ))}
      </div>

      {/* Load More Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="mt-8">
          {loading && <LoadingSpinner />}
        </div>
      )}

      {/* End of List */}
      {!hasNextPage && animeList.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8 py-8 space-y-2"
        >
          <p className="text-lg font-medium text-foreground">You've reached the end!</p>
          <p className="text-sm text-muted-foreground">That's all the anime we have for now.</p>
        </motion.div>
      )}
    </div>
  );
};

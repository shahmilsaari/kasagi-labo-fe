import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { animeApi } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnimeStore } from '@/store/useAnimeStore';
import type { Anime } from '@/types/anime';

export const PopularAnime = () => {
  const navigate = useNavigate();
  const { isFavorite } = useAnimeStore();
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        setLoading(true);
        const response = await animeApi.getAnimeList(1, 8);
        setPopularAnime(response.data);
      } catch (error) {
        console.error('Failed to fetch popular anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAnime();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Popular Anime</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded-t-lg" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">Popular Anime</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {popularAnime.map((anime, index) => (
          <motion.div
            key={anime.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={() => navigate(`/anime/${anime.mal_id}`)}
          >
            <Card className="overflow-hidden cursor-pointer group relative border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Score Badge */}
                {anime.score && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500/90 text-black hover:bg-yellow-500 backdrop-blur-sm border-none">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {anime.score.toFixed(1)}
                  </Badge>
                )}

                {/* Favorite Indicator */}
                {isFavorite(anime.mal_id) && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-destructive/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Heart className="w-4 h-4 text-white fill-current" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-3 space-y-2">
                <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem] text-sm leading-tight">
                  {anime.title}
                </h3>

                {/* Genres */}
                <div className="flex flex-wrap gap-1">
                  {anime.genres?.slice(0, 2).map((genre) => (
                    <Badge
                      key={genre.mal_id}
                      variant="secondary"
                      className="text-xs px-2 py-0"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Meta */}
                {anime.episodes && (
                  <p className="text-xs text-muted-foreground">
                    {anime.episodes} Episodes
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useAnimeStore } from '@/store/useAnimeStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Anime } from '@/types/anime';

interface AnimeCardProps {
  anime: Anime;
  index: number;
}

export const AnimeCard = ({ anime, index }: AnimeCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useAnimeStore();
  const favorite = isFavorite(anime.mal_id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime);
    }
  };

  const handleCardClick = () => {
    navigate(`/anime/${anime.mal_id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden cursor-pointer group relative border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Favorite Button */}
          <Button
            size="icon"
            variant={favorite ? "default" : "secondary"}
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-2 right-2 z-10 shadow-lg backdrop-blur-sm",
              favorite ? "bg-destructive hover:bg-destructive/90" : "bg-background/80"
            )}
          >
            {favorite ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
            ) : (
              <Heart className="w-4 h-4" />
            )}
          </Button>

          {/* Score Badge */}
          {anime.score && (
            <Badge className="absolute bottom-2 left-2 bg-yellow-500/90 text-black hover:bg-yellow-500 backdrop-blur-sm border-none">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {anime.score.toFixed(1)}
            </Badge>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem] text-sm leading-tight">
            {anime.title}
          </h3>

          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {anime.genres.slice(0, 2).map((genre) => (
                <Badge
                  key={genre.mal_id}
                  variant="secondary"
                  className="text-xs px-2 py-0"
                >
                  {genre.name}
                </Badge>
              ))}
              {anime.genres.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{anime.genres.length - 2}
                </Badge>
              )}
            </div>
          )}

          {anime.episodes && (
            <p className="text-xs text-muted-foreground">
              {anime.episodes} {anime.episodes === 1 ? 'Episode' : 'Episodes'}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

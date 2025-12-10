import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import { animeApi } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Anime } from '@/types/anime';

type TimeFilter = 'day' | 'week' | 'month';

export const NewReleases = () => {
  const navigate = useNavigate();
  const [releases, setReleases] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('day');

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        const response = await animeApi.getAnimeList(1, 10);
        setReleases(response.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch releases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [activeFilter]);

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-24 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-6 space-y-6">
        {/* Header with Tabs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">New Release</h2>

          {/* Time Filter Tabs */}
          <div className="flex gap-2 border-b border-border/50">
            {(['day', 'week', 'month'] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2 text-sm font-medium capitalize transition-colors relative",
                  activeFilter === filter
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter}
                {activeFilter === filter && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Releases List */}
        <div className="space-y-4">
          {releases.map((anime, index) => (
            <motion.div
              key={anime.mal_id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/anime/${anime.mal_id}`)}
              className="group cursor-pointer"
            >
              <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                {/* Anime Image */}
                <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors">
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

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {anime.season && anime.year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="capitalize">{anime.season} {anime.year}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4">
                    {anime.score && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < Math.round((anime.score || 0) / 2)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, ThumbsUp, User, ExternalLink, Sparkles } from 'lucide-react';
import { animeApi } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AnimeReview } from '@/types/anime';

export const TopReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<AnimeReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        setLoading(true);
        const response = await animeApi.getTopReviews(1);
        // Get top 5 reviews sorted by overall reactions
        const topReviews = response.data
          .sort((a, b) => b.reactions.overall - a.reactions.overall)
          .slice(0, 5);
        setReviews(topReviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopReviews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Top Anime Reviews
            </h2>
            <p className="text-muted-foreground text-sm">
              Most helpful reviews from the community
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
                  onClick={() => navigate(`/anime/${review.entry.mal_id}`)}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Anime Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-28 rounded-lg overflow-hidden">
                      <img
                        src={review.entry.images.jpg.image_url}
                        alt={review.entry.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-1 left-1 bg-yellow-500 hover:bg-yellow-500 text-black text-xs px-2 py-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Top
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {review.entry.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{review.user.username}</span>
                          <span>•</span>
                          <span>{new Date(review.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {review.score}
                      </Badge>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {review.review}
                    </p>

                    {/* Tags */}
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {review.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {review.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{review.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Reactions */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{review.reactions.overall.toLocaleString()}</span>
                      </div>
                      {review.reactions.nice > 0 && (
                        <span>👍 {review.reactions.nice}</span>
                      )}
                      {review.reactions.love_it > 0 && (
                        <span>❤️ {review.reactions.love_it}</span>
                      )}
                      {review.reactions.funny > 0 && (
                        <span>😄 {review.reactions.funny}</span>
                      )}
                    </div>

                    {/* Read More Link */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(review.url, '_blank');
                      }}
                    >
                      Read full review
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

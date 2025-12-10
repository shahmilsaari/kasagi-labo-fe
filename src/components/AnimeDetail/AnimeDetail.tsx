import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineCalendar,
  AiOutlinePlayCircle,
} from 'react-icons/ai';
import { useAnimeDetail } from '@/hooks/useAnimeDetail';
import { useAnimeStore } from '@/store/useAnimeStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { anime, loading, error } = useAnimeDetail(Number(id));
  const { isFavorite, addFavorite, removeFavorite } = useAnimeStore();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !anime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/60 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center shadow-lg"
        >
          <h3 className="text-red-800 dark:text-red-200 font-semibold text-lg mb-2">Error Loading Anime</h3>
          <p className="text-red-600 dark:text-red-100">{error || 'Anime not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const favorite = isFavorite(anime.mal_id);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${anime.images.jpg.large_image_url})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </div>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 p-3 bg-white/90 text-gray-900 rounded-full shadow-xl hover:bg-gray-100 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-800/70 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AiOutlineArrowLeft className="w-6 h-6" />
        </motion.button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-48 md:w-64 flex-shrink-0"
              >
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              </motion.div>

              {/* Title and Info */}
              <div className="flex-1 text-white">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl font-bold mb-2"
                >
                  {anime.title}
                </motion.h1>

                {anime.title_english && anime.title_english !== anime.title && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-300 mb-4"
                  >
                    {anime.title_english}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-4 items-center mb-4"
                >
                  {anime.score && (
                    <div className="flex items-center gap-2 bg-yellow-500 px-3 py-1.5 rounded-lg">
                      <AiFillStar className="w-5 h-5" />
                      <span className="font-bold text-lg">{anime.score.toFixed(1)}</span>
                    </div>
                  )}

                  <motion.button
                    onClick={handleFavoriteClick}
                    className="flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 dark:bg-black/60 dark:hover:bg-white/10 dark:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {favorite ? (
                      <>
                        <AiFillHeart className="w-5 h-5 text-red-500" />
                        <span className="font-medium">Favorited</span>
                      </>
                    ) : (
                      <>
                        <AiOutlineHeart className="w-5 h-5" />
                        <span className="font-medium">Add to Favorites</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4 text-sm text-gray-200"
                >
                  {anime.year && (
                    <div className="flex items-center gap-1">
                      <AiOutlineCalendar className="w-4 h-4" />
                      <span>{anime.year}</span>
                    </div>
                  )}
                  {anime.episodes && (
                    <div className="flex items-center gap-1">
                      <AiOutlinePlayCircle className="w-4 h-4" />
                      <span>{anime.episodes} Episodes</span>
                    </div>
                  )}
                  {anime.status && (
                    <span className="px-2 py-0.5 rounded border border-white/30 bg-white/20 dark:bg-white/10 dark:border-white/20">
                      {anime.status}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Synopsis */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-slate-900/70 dark:border dark:border-white/5 rounded-lg shadow-lg shadow-black/20 p-6 backdrop-blur"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Synopsis</h2>
              <p className="text-gray-700 dark:text-slate-200 leading-relaxed">
                {anime.synopsis || 'No synopsis available.'}
              </p>
            </motion.section>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-slate-900/70 dark:border dark:border-white/5 rounded-lg shadow-lg shadow-black/20 p-6 backdrop-blur"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium dark:bg-primary/10 dark:text-primary-100"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Themes */}
            {anime.themes && anime.themes.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white dark:bg-slate-900/70 dark:border dark:border-white/5 rounded-lg shadow-lg shadow-black/20 p-6 backdrop-blur"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Themes</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.themes.map((theme) => (
                    <span
                      key={theme.mal_id}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium dark:bg-purple-900/50 dark:text-purple-100"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-slate-900/70 dark:border dark:border-white/5 rounded-lg shadow-lg shadow-black/20 p-6 backdrop-blur"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Information</h2>
              <div className="space-y-3 text-sm">
                {anime.rank && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-300">Rank:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">#{anime.rank}</span>
                  </div>
                )}
                {anime.popularity && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-300">Popularity:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">#{anime.popularity}</span>
                  </div>
                )}
                {anime.members && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-300">Members:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {anime.members.toLocaleString()}
                    </span>
                  </div>
                )}
                {anime.favorites && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-300">Favorites:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {anime.favorites.toLocaleString()}
                    </span>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-300">Duration:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{anime.duration}</span>
                  </div>
                )}
                {anime.rating && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-300">Rating:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{anime.rating}</span>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-slate-900/70 dark:border dark:border-white/5 rounded-lg shadow-lg shadow-black/20 p-6 backdrop-blur"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Studios</h2>
                <div className="space-y-2">
                  {anime.studios.map((studio) => (
                    <div key={studio.mal_id} className="text-gray-700 dark:text-slate-200">
                      {studio.name}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

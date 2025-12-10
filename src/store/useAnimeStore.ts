import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Anime, FavoriteAnime, Genre } from '@/types/anime';

interface AnimeStore {
  // Anime list state
  animeList: Anime[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;

  // Filters
  selectedGenre: number | null;
  searchQuery: string;

  // Genres
  genres: Genre[];
  genresLoading: boolean;

  // Favorites
  favorites: FavoriteAnime[];

  // Actions
  setAnimeList: (anime: Anime[]) => void;
  appendAnimeList: (anime: Anime[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setHasNextPage: (hasNext: boolean) => void;
  setTotalPages: (total: number) => void;
  setSelectedGenre: (genreId: number | null) => void;
  setSearchQuery: (query: string) => void;
  setGenres: (genres: Genre[]) => void;
  setGenresLoading: (loading: boolean) => void;
  resetFilters: () => void;

  // Favorites actions
  addFavorite: (anime: Anime) => void;
  removeFavorite: (malId: number) => void;
  isFavorite: (malId: number) => boolean;
  clearFavorites: () => void;
}

export const useAnimeStore = create<AnimeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      animeList: [],
      loading: false,
      error: null,
      currentPage: 1,
      hasNextPage: true,
      totalPages: 1,
      selectedGenre: null,
      searchQuery: '',
      genres: [],
      genresLoading: false,
      favorites: [],

      // Anime list actions
      setAnimeList: (anime) => set({ animeList: anime }),

      appendAnimeList: (anime) =>
        set((state) => ({
          animeList: [...state.animeList, ...anime],
        })),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setCurrentPage: (page) => set({ currentPage: page }),

      setHasNextPage: (hasNext) => set({ hasNextPage: hasNext }),

      setTotalPages: (total) => set({ totalPages: total }),

      setSelectedGenre: (genreId) =>
        set({
          selectedGenre: genreId,
          currentPage: 1,
          animeList: [],
        }),

      setSearchQuery: (query) =>
        set({
          searchQuery: query,
          currentPage: 1,
          animeList: [],
        }),

      setGenres: (genres) => set({ genres }),

      setGenresLoading: (loading) => set({ genresLoading: loading }),

      resetFilters: () =>
        set({
          selectedGenre: null,
          searchQuery: '',
          currentPage: 1,
          animeList: [],
        }),

      // Favorites actions
      addFavorite: (anime) => {
        const { favorites } = get();

        // Check if already favorited
        if (favorites.some((fav) => fav.mal_id === anime.mal_id)) {
          return;
        }

        const favorite: FavoriteAnime = {
          mal_id: anime.mal_id,
          title: anime.title,
          image_url: anime.images.jpg.image_url,
          score: anime.score,
          addedAt: Date.now(),
        };

        set({ favorites: [...favorites, favorite] });
      },

      removeFavorite: (malId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((fav) => fav.mal_id !== malId) });
      },

      isFavorite: (malId) => {
        const { favorites } = get();
        return favorites.some((fav) => fav.mal_id === malId);
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'anime-storage',
      // Only persist favorites
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);

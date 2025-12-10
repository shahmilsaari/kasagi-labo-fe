import { useEffect, useCallback } from 'react';
import { useAnimeStore } from '@/store/useAnimeStore';
import { animeApi } from '@/services/api';

export const useAnimeList = () => {
  const {
    animeList,
    loading,
    error,
    currentPage,
    hasNextPage,
    selectedGenre,
    searchQuery,
    setAnimeList,
    appendAnimeList,
    setLoading,
    setError,
    setCurrentPage,
    setHasNextPage,
    setTotalPages,
  } = useAnimeStore();

  const fetchAnime = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        let response;

        if (searchQuery) {
          response = await animeApi.searchAnime(searchQuery, page);
        } else if (selectedGenre) {
          response = await animeApi.getAnimeList(page, 24, selectedGenre);
        } else {
          response = await animeApi.getAnimeList(page);
        }

        if (append) {
          appendAnimeList(response.data);
        } else {
          setAnimeList(response.data);
        }

        setCurrentPage(page);
        setHasNextPage(response.pagination.has_next_page);
        setTotalPages(response.pagination.last_visible_page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch anime');
      } finally {
        setLoading(false);
      }
    },
    [
      searchQuery,
      selectedGenre,
      setLoading,
      setError,
      setAnimeList,
      appendAnimeList,
      setCurrentPage,
      setHasNextPage,
      setTotalPages,
    ]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      fetchAnime(currentPage + 1, true);
    }
  }, [loading, hasNextPage, currentPage, fetchAnime]);

  const refresh = useCallback(() => {
    fetchAnime(1, false);
  }, [fetchAnime]);

  useEffect(() => {
    // Only fetch on mount or when filters change
    if (animeList.length === 0) {
      fetchAnime(1);
    }
  }, [selectedGenre, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    animeList,
    loading,
    error,
    hasNextPage,
    currentPage,
    loadMore,
    refresh,
  };
};

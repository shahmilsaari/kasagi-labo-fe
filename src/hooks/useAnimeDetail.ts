import { useState, useEffect } from 'react';
import { animeApi } from '@/services/api';
import type { Anime } from '@/types/anime';

export const useAnimeDetail = (id: number) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await animeApi.getAnimeById(id);
        setAnime(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch anime details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeDetail();
    }
  }, [id]);

  return { anime, loading, error };
};

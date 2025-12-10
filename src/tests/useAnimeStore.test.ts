import { describe, it, expect, beforeEach } from 'vitest';
import { useAnimeStore } from '@/store/useAnimeStore';
import type { Anime } from '@/types/anime';

describe('useAnimeStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useAnimeStore.getState();
    store.setAnimeList([]);
    store.setSelectedGenre(null);
    store.setSearchQuery('');
    store.clearFavorites();
  });

  it('should add anime to favorites', () => {
    const mockAnime: Anime = {
      mal_id: 1,
      title: 'Test Anime',
      images: {
        jpg: {
          image_url: 'test.jpg',
          small_image_url: 'test-small.jpg',
          large_image_url: 'test-large.jpg',
        },
        webp: {
          image_url: 'test.webp',
          small_image_url: 'test-small.webp',
          large_image_url: 'test-large.webp',
        },
      },
      score: 8.5,
    };

    const { addFavorite, favorites, isFavorite } = useAnimeStore.getState();

    expect(favorites).toHaveLength(0);
    expect(isFavorite(1)).toBe(false);

    addFavorite(mockAnime);

    const updatedState = useAnimeStore.getState();
    expect(updatedState.favorites).toHaveLength(1);
    expect(updatedState.isFavorite(1)).toBe(true);
    expect(updatedState.favorites[0].mal_id).toBe(1);
    expect(updatedState.favorites[0].title).toBe('Test Anime');
  });

  it('should remove anime from favorites', () => {
    const mockAnime: Anime = {
      mal_id: 1,
      title: 'Test Anime',
      images: {
        jpg: {
          image_url: 'test.jpg',
          small_image_url: 'test-small.jpg',
          large_image_url: 'test-large.jpg',
        },
        webp: {
          image_url: 'test.webp',
          small_image_url: 'test-small.webp',
          large_image_url: 'test-large.webp',
        },
      },
    };

    const { addFavorite, removeFavorite } = useAnimeStore.getState();

    addFavorite(mockAnime);
    expect(useAnimeStore.getState().favorites).toHaveLength(1);

    removeFavorite(1);
    expect(useAnimeStore.getState().favorites).toHaveLength(0);
  });

  it('should not add duplicate favorites', () => {
    const mockAnime: Anime = {
      mal_id: 1,
      title: 'Test Anime',
      images: {
        jpg: {
          image_url: 'test.jpg',
          small_image_url: 'test-small.jpg',
          large_image_url: 'test-large.jpg',
        },
        webp: {
          image_url: 'test.webp',
          small_image_url: 'test-small.webp',
          large_image_url: 'test-large.webp',
        },
      },
    };

    const { addFavorite } = useAnimeStore.getState();

    addFavorite(mockAnime);
    addFavorite(mockAnime);

    expect(useAnimeStore.getState().favorites).toHaveLength(1);
  });

  it('should set selected genre', () => {
    const { setSelectedGenre } = useAnimeStore.getState();

    setSelectedGenre(5);
    expect(useAnimeStore.getState().selectedGenre).toBe(5);

    setSelectedGenre(null);
    expect(useAnimeStore.getState().selectedGenre).toBe(null);
  });

  it('should reset filters', () => {
    const { setSelectedGenre, setSearchQuery, resetFilters } = useAnimeStore.getState();

    setSelectedGenre(5);
    setSearchQuery('test');

    expect(useAnimeStore.getState().selectedGenre).toBe(5);
    expect(useAnimeStore.getState().searchQuery).toBe('test');

    resetFilters();

    const state = useAnimeStore.getState();
    expect(state.selectedGenre).toBe(null);
    expect(state.searchQuery).toBe('');
    expect(state.animeList).toHaveLength(0);
  });
});

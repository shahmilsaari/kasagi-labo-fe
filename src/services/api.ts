import axios, { AxiosError } from 'axios';
import type { AnimeResponse, GenreResponse, AnimeDetailResponse, ReviewsResponse } from '@/types/anime';

const API_BASE_URL = 'https://api.jikan.moe/v4';

// Jikan API has rate limiting (3 requests/second, 60 requests/minute)
// Implement simple request queue to avoid hitting rate limits
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private readonly MIN_INTERVAL = 350; // ~3 requests per second

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.MIN_INTERVAL) {
      await new Promise(resolve =>
        setTimeout(resolve, this.MIN_INTERVAL - timeSinceLastRequest)
      );
    }

    const request = this.queue.shift();
    if (request) {
      this.lastRequestTime = Date.now();
      await request();
    }

    this.process();
  }
}

const requestQueue = new RequestQueue();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);

      if (error.response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }

      if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    throw error;
  }
);

export const animeApi = {
  /**
   * Get paginated list of anime
   */
  getAnimeList: async (page: number = 1, limit: number = 24, genreId?: number) => {
    return requestQueue.add(async () => {
      const params: Record<string, any> = {
        page,
        limit,
        sfw: true, // Safe for work content only
      };

      if (genreId) {
        params.genres = genreId;
      }

      const response = await apiClient.get<AnimeResponse>('/anime', { params });
      return response.data;
    });
  },

  /**
   * Get anime by ID
   */
  getAnimeById: async (id: number) => {
    return requestQueue.add(async () => {
      const response = await apiClient.get<AnimeDetailResponse>(`/anime/${id}`);
      return response.data;
    });
  },

  /**
   * Search anime by query
   */
  searchAnime: async (query: string, page: number = 1, limit: number = 24) => {
    return requestQueue.add(async () => {
      const response = await apiClient.get<AnimeResponse>('/anime', {
        params: {
          q: query,
          page,
          limit,
          sfw: true,
        },
      });
      return response.data;
    });
  },

  /**
   * Get all available genres
   */
  getGenres: async () => {
    return requestQueue.add(async () => {
      const response = await apiClient.get<GenreResponse>('/genres/anime');
      return response.data;
    });
  },

  /**
   * Get top anime reviews
   */
  getTopReviews: async (page: number = 1) => {
    return requestQueue.add(async () => {
      const response = await apiClient.get<ReviewsResponse>('/reviews/anime', {
        params: {
          page,
          preliminary: false,
          spoiler: false,
        },
      });
      return response.data;
    });
  },

};

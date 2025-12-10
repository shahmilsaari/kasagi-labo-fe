export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  episodes?: number;
  status?: string;
  airing?: boolean;
  aired?: {
    from: string;
    to: string;
    string: string;
  };
  duration?: string;
  rating?: string;
  season?: string;
  year?: number;
  studios?: Array<{
    mal_id: number;
    name: string;
  }>;
  genres?: Genre[];
  themes?: Genre[];
  demographics?: Genre[];
}

export interface Genre {
  mal_id: number;
  name: string;
  type: string;
}

export interface AnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface GenreResponse {
  data: Genre[];
}

export interface AnimeDetailResponse {
  data: Anime;
}

export interface FavoriteAnime {
  mal_id: number;
  title: string;
  image_url: string;
  score?: number;
  addedAt: number;
}

export interface AnimeReview {
  mal_id: number;
  url: string;
  type: string;
  reactions: {
    overall: number;
    nice: number;
    love_it: number;
    funny: number;
    confusing: number;
    informative: number;
    well_written: number;
    creative: number;
  };
  date: string;
  review: string;
  score: number;
  tags: string[];
  is_spoiler: boolean;
  is_preliminary: boolean;
  episodes_watched?: number;
  user: {
    url: string;
    username: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
      };
    };
  };
  entry: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    title: string;
  };
}

export interface ReviewsResponse {
  data: AnimeReview[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

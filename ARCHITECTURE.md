# Anime Explorer - Architecture Documentation

## Overview

This document provides a detailed overview of the Anime Explorer application architecture, design decisions, and implementation details.

## Technology Stack

### Core Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript 5**: Full type safety and enhanced developer experience
- **Vite 5**: Lightning-fast build tool and dev server

### State Management
- **Zustand**: Lightweight state management with middleware support
- **Zustand Persist**: Automatic localStorage persistence for favorites

### Routing
- **React Router v6**: Declarative routing with modern API

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

### Animations
- **Framer Motion**: Production-ready motion library
- **React Intersection Observer**: Efficient scroll detection

### API & Data Fetching
- **Axios**: Promise-based HTTP client
- **Jikan API**: Unofficial MyAnimeList API

### Testing
- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM environment for tests

## Architecture Patterns

### 1. Component Architecture

#### Component Categories

**Presentational Components** (src/components/)
- Pure UI components with minimal logic
- Receive data via props
- Examples: `AnimeCard`, `LoadingSpinner`

**Container Components** (src/pages/)
- Connect to stores and services
- Handle business logic
- Examples: `Home`

**Feature Components** (src/components/)
- Self-contained features with own logic
- Examples: `FilterBar`, `Favorites`

#### Component Organization
```
ComponentName/
├── ComponentName.tsx    # Main component
├── index.ts            # Barrel export
└── ComponentName.test.tsx (optional)
```

### 2. State Management Strategy

#### Zustand Store Structure
```typescript
interface AnimeStore {
  // UI State
  loading: boolean
  error: string | null

  // Data
  animeList: Anime[]
  favorites: FavoriteAnime[]
  genres: Genre[]

  // Filters
  selectedGenre: number | null
  searchQuery: string

  // Pagination
  currentPage: number
  hasNextPage: boolean

  // Actions
  setAnimeList: (anime: Anime[]) => void
  addFavorite: (anime: Anime) => void
  // ... more actions
}
```

#### State Persistence
- Only favorites are persisted to localStorage
- Other state is ephemeral (resets on page reload)
- Uses Zustand's persist middleware

### 3. API Integration

#### Request Queue System
```typescript
class RequestQueue {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private readonly MIN_INTERVAL = 350ms // ~3 req/sec

  async add<T>(request: () => Promise<T>): Promise<T>
  private async process()
}
```

**Why Request Queue?**
- Jikan API has strict rate limits (3 req/sec, 60 req/min)
- Prevents 429 (Too Many Requests) errors
- Maintains smooth UX while respecting limits

#### Error Handling Strategy
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded')
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error')
    }
    throw error
  }
)
```

### 4. Custom Hooks

#### useAnimeList Hook
```typescript
export const useAnimeList = () => {
  // Fetches anime based on filters
  // Handles pagination
  // Returns list and utility functions
  return {
    animeList,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh
  }
}
```

**Responsibilities:**
- Abstract API calls from components
- Handle loading and error states
- Coordinate with Zustand store
- Provide clean interface for components

#### useAnimeDetail Hook
```typescript
export const useAnimeDetail = (id: number) => {
  // Fetches single anime details
  // Local state (not in Zustand)
  return { anime, loading, error }
}
```

**Why Local State?**
- Detail data is transient
- No need for global persistence
- Reduces store complexity

### 5. Performance Optimizations

#### Infinite Scroll Implementation
```typescript
// Use Intersection Observer API
const { ref: loadMoreRef, inView } = useInView({
  threshold: 0.5,
  triggerOnce: false
})

useEffect(() => {
  if (inView && hasNextPage && !loading) {
    loadMore()
  }
}, [inView, hasNextPage, loading, loadMore])
```

**Benefits:**
- No scroll event listeners (better performance)
- Efficient viewport detection
- Automatic cleanup

#### Image Loading
- Native lazy loading: `loading="lazy"`
- Aspect ratio boxes prevent layout shift
- WebP support with JPG fallback

#### Code Splitting
- Route-based splitting (automatic with Vite)
- Dynamic imports for heavy components
- Tree shaking for unused code

### 6. Responsive Design Strategy

#### Breakpoint System (Tailwind)
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Small desktop */
xl: 1280px  /* Desktop */
```

#### Grid System
```tsx
// Responsive anime grid
grid grid-cols-2       /* Mobile: 2 columns */
sm:grid-cols-3         /* Small: 3 columns */
md:grid-cols-4         /* Medium: 4 columns */
lg:grid-cols-5         /* Large: 5 columns */
xl:grid-cols-6         /* XL: 6 columns */
```

### 7. Animation Strategy

#### Framer Motion Patterns

**Stagger Animation**
```tsx
// Cards animate in sequence
transition={{ duration: 0.3, delay: index * 0.05 }}
```

**Hover Effects**
```tsx
whileHover={{ y: -8 }}
whileTap={{ scale: 0.95 }}
```

**Route Transitions**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

### 8. Type Safety

#### Type Organization
```
types/
└── anime.ts
    ├── Anime (main entity)
    ├── Genre
    ├── AnimeResponse (API response)
    ├── GenreResponse
    └── FavoriteAnime (app-specific)
```

#### Generic Type Usage
```typescript
// API wrapper with type safety
async add<T>(request: () => Promise<T>): Promise<T>
```

## Data Flow

### Anime List Flow
```
1. User visits home
2. useAnimeList hook initializes
3. Checks Zustand store for existing data
4. If empty, calls animeApi.getAnimeList()
5. Request goes through RequestQueue
6. Response stored in Zustand
7. Component re-renders with data
8. User scrolls to bottom
9. Intersection Observer triggers
10. loadMore() appends new data
```

### Favorites Flow
```
1. User clicks heart icon on anime card
2. AnimeCard calls useAnimeStore.addFavorite()
3. Store adds to favorites array
4. Zustand persist middleware saves to localStorage
5. UI updates with filled heart
6. Favorite counter updates in navigation
7. On page reload, favorites restored from localStorage
```

### Filter Flow
```
1. User selects genre/searches
2. FilterBar updates Zustand state
3. Store resets animeList and currentPage
4. useAnimeList detects filter change (useEffect)
5. Fetches new data with filters
6. AnimeList re-renders with filtered results
```

## Security Considerations

### XSS Prevention
- React automatically escapes content
- No dangerouslySetInnerHTML usage
- API responses are typed and validated

### API Security
- All requests go through Axios interceptors
- Error messages sanitized
- No sensitive data in localStorage
- HTTPS only (enforced by Jikan API)

## Testing Strategy

### Unit Tests
- Zustand store logic
- Custom hooks (if complex)
- Utility functions

### Integration Tests (Future)
- Component interactions
- API mocking with MSW
- User flow testing

### E2E Tests (Future)
- Critical user paths
- Cross-browser testing

## Build & Deployment

### Production Build
```bash
npm run build
# Output: dist/
# - index.html
# - assets/
#   - index-[hash].js
#   - index-[hash].css
```

### Build Optimizations
- Tree shaking (Vite)
- Minification (terser)
- Asset hashing for cache busting
- CSS purging (unused Tailwind classes removed)

### Deployment Considerations
- Static hosting (Netlify, Vercel, Cloudflare Pages)
- SPA routing configuration needed
- Environment variables for API base URL (if custom backend)

## Future Architecture Improvements

### 1. Caching Layer
```typescript
// Add React Query or SWR
const { data, error } = useQuery('anime-list', fetchAnime, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000 // 10 minutes
})
```

### 2. Virtual Scrolling
```typescript
// For very long lists
import { useVirtualizer } from '@tanstack/react-virtual'
```

### 3. Service Worker
- Offline support
- Cache API responses
- Background sync for favorites

### 4. Code Splitting by Route
```typescript
const AnimeDetail = lazy(() => import('./components/AnimeDetail'))
const Favorites = lazy(() => import('./components/Favorites'))
```

### 5. Analytics Integration
```typescript
// Track user behavior
useEffect(() => {
  analytics.track('page_view', { path: location.pathname })
}, [location])
```

## Development Guidelines

### Adding New Features
1. Create types in `src/types/`
2. Add API methods in `src/services/`
3. Create/update Zustand store if needed
4. Build components in `src/components/`
5. Add tests in `src/tests/`
6. Update documentation

### Code Style
- Use functional components with hooks
- Prefer const over let
- Use TypeScript strict mode
- Follow existing naming conventions
- Keep components under 300 lines

### Git Workflow
- Feature branches from main
- Descriptive commit messages
- PR reviews required
- CI/CD checks must pass

## Performance Benchmarks

### Target Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

### Bundle Size
- JavaScript: ~343 KB (gzipped: ~114 KB)
- CSS: ~19 KB (gzipped: ~4 KB)
- Total: ~362 KB

### Optimization Techniques Applied
1. Code splitting by route
2. Image lazy loading
3. Request queue for API
4. Memoization where needed
5. Virtualization for long lists (future)

## Troubleshooting

### Common Issues

**API Rate Limiting**
- Increase MIN_INTERVAL in RequestQueue
- Add exponential backoff

**Memory Leaks**
- Check for cleanup in useEffect
- Ensure Zustand subscriptions are released

**Build Failures**
- Clear node_modules and reinstall
- Check TypeScript errors
- Verify all imports resolve

## Resources

- [React Documentation](https://react.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Jikan API Documentation](https://docs.api.jikan.moe/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

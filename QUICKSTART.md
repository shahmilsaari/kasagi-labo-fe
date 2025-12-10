# Quick Start Guide 🚀

Get up and running with Anime Explorer in less than 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A modern web browser

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React, React Router, and React DOM
- TypeScript and Vite
- Zustand for state management
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 3. Start Exploring!

Open your browser and start exploring anime!

## Available Commands

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Building
npm run build        # Create production build
npm run preview      # Preview production build locally

# Testing
npm run test         # Run unit tests
npm run test:ui      # Run tests with Vitest UI

# Code Quality
npm run lint         # Check for linting errors
```

## Features to Try

### 1. Browse Anime
- Scroll through the anime list
- Images, titles, and scores are displayed
- Infinite scroll loads more content automatically

### 2. Search
- Use the search bar at the top
- Press Enter or wait for auto-search
- Clear with the X button

### 3. Filter by Genre
- Click the "Filters" button
- Select a genre from the list
- Clear filters with the "Clear" button

### 4. View Details
- Click any anime card
- See full synopsis, genres, and stats
- Navigate back with the arrow button

### 5. Add Favorites
- Click the heart icon on any anime
- Visit the Favorites tab to see your collection
- Favorites persist across browser sessions

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page-level components
├── hooks/           # Custom React hooks
├── services/        # API integration
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── tests/           # Unit tests
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Tips & Tricks

### Performance
- The app automatically queues API requests to avoid rate limiting
- Images load lazily as you scroll
- Favorites are saved to localStorage automatically

### Mobile Experience
- Fully responsive design works on all screen sizes
- Touch-optimized for mobile devices
- Swipe gestures supported

### Keyboard Shortcuts
- **Enter** in search bar: Search
- **Escape**: Clear search (if implemented)
- **Browser back button**: Navigate back

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Vite will automatically use the next available port.

### API Rate Limiting
If you see rate limit errors:
1. Wait a few seconds
2. The app automatically queues requests
3. Reduce rapid filter changes

### Favorites Not Saving
Check if your browser allows localStorage:
1. Open browser DevTools
2. Go to Application > Local Storage
3. Look for `anime-storage` key

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

### For Users
1. Explore different genres
2. Build your favorites collection
3. Share anime details with friends

### For Developers
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture
2. Check [README.md](./README.md) for full documentation
3. Review the codebase to understand patterns
4. Add new features or improvements

## Common Development Tasks

### Add a New Component
```bash
# Create component directory
mkdir src/components/NewComponent

# Create files
touch src/components/NewComponent/NewComponent.tsx
touch src/components/NewComponent/index.ts
```

### Add a New Route
```tsx
// In src/App.tsx
<Route path="/new-route" element={<NewComponent />} />
```

### Update API Integration
```typescript
// In src/services/api.ts
export const animeApi = {
  // Add new method
  newMethod: async () => {
    // Implementation
  }
}
```

## Resources

- **API Documentation**: [Jikan API Docs](https://docs.api.jikan.moe/)
- **React Docs**: [react.dev](https://react.dev)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)

## Support

For issues or questions:
1. Check the [README.md](./README.md)
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Search existing issues
4. Create a new issue with details

---

Happy coding! 🎉

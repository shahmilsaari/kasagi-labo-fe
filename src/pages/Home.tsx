import { PopularAnime } from '@/components/PopularAnime';
import { NewReleases } from '@/components/NewReleases';
import { AnimeList } from '@/components/AnimeList';

export const Home = () => {
  return (
    <>
      {/* Popular Anime and New Releases Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Anime - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <PopularAnime />
          </div>

          {/* Sidebar with New Releases - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-[180px]">
              <NewReleases />
            </div>
          </div>
        </div>
      </div>

      {/* All Anime List Section */}
      <div className="container mx-auto px-4 py-8">
        <AnimeList />
      </div>
    </>
  );
};

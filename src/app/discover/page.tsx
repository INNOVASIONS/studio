import { getPhotos, getUsers } from '@/lib/mock-data';
import { PhotoCard } from '@/components/wanderlens/photo-card';

export default function DiscoverPage() {
  const photos = getPhotos();
  const users = getUsers();

  const findUser = (userId: number) => users.find((u) => u.id === userId);

  // A simple shuffle function
  const shuffledPhotos = [...photos].sort(() => 0.5 - Math.random());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Discover Your Next Adventure
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore trending photos and popular destinations from travelers around the globe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shuffledPhotos.map((photo) => {
          const user = findUser(photo.userId);
          return user ? (
            <div key={photo.id} className="flex justify-center">
              <PhotoCard photo={photo} user={user} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

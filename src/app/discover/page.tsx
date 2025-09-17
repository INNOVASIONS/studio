'use client';

import { useEffect, useState } from 'react';
import { getPhotos, getUsers, getCurrentUser } from '@/lib/mock-data';
import { PhotoCard } from '@/components/wanderlens/photo-card';
import { Photo, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DiscoverPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [photosData, usersData, currentUserData] = await Promise.all([
          getPhotos(),
          getUsers(),
          getCurrentUser(),
        ]);
        // A simple shuffle function
        const shuffledPhotos = [...photosData].sort(() => 0.5 - Math.random());
        setPhotos(shuffledPhotos);
        setUsers(usersData);
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const findUser = (userId: number) => users.find((u) => u.id === userId);

  if (loading || !currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Skeleton className="h-14 w-2/3 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        {photos.map((photo) => {
          const user = findUser(photo.userId);
          return user ? (
            <div key={photo.id} className="flex justify-center">
              <PhotoCard photo={photo} user={user} currentUser={currentUser} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

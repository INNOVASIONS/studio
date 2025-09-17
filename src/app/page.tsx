
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, Globe, Map, Wallet, Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPhotos, getUsers, getCurrentUser } from '@/lib/mock-data';
import { PhotoCard } from '@/components/wanderlens/photo-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AddPostDialog } from '@/components/wanderlens/add-post-dialog';
import { Photo, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const featureCards = [
    {
        icon: FileText,
        title: "AI Itinerary Generator",
        description: "Craft your perfect journey in seconds. Let our AI be your personal travel agent.",
        href: "/itinerary-generator",
        cta: "Generate Itinerary",
    },
    {
        icon: Globe,
        title: "AI Location Finder",
        description: "Ever wonder where a photo was taken? Upload an image and let our AI pinpoint the location.",
        href: "/location-finder",
        cta: "Find Location",
    },
    {
        icon: Map,
        title: "Nearby Places",
        description: "Discover restaurants and points of interest near you or at your next destination.",
        href: "/nearby-places",
        cta: "Explore Nearby",
    },
    {
        icon: Wallet,
        title: "Trip Expense Calculator",
        description: "Track your travel spending on accommodation, food, transport, and more.",
        href: "/trip-expenses",
        cta: "Calculate Expenses",
    },
]

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Use a timeout to ensure localStorage is populated on first load
        setTimeout(async () => {
          const [photosData, usersData, currentUserData] = await Promise.all([
            getPhotos(),
            getUsers(),
            getCurrentUser(),
          ]);
          setPhotos(photosData);
          setUsers(usersData);
          setCurrentUser(currentUserData);
          setLoading(false);
        }, 100); // A small delay can help in some race conditions with localStorage initialization.
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const findUser = (userId: number) => users.find((u) => u.id === userId);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <section className="text-center mb-16">
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
          <div className="mt-8 flex justify-center gap-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-36" />
          </div>
        </section>
        <section>
          <Skeleton className="h-10 w-1/3 mx-auto mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="h-[250px] w-full" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (!currentUser) {
     return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Loading User Profile...</h2>
            <p className="text-muted-foreground mt-2">
                If you are not redirected, please <Link href="/auth" className="text-primary underline">log in</Link>.
            </p>
        </div>
      </div>
     )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary mb-4">
          Capture Your Journey.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          WanderLens is your personal canvas to paint your travel stories. Share moments, discover hidden gems, and inspire others to explore the world.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/discover">
              Explore Photos <ArrowRight />
            </Link>
          </Button>
          <AddPostDialog>
            <Button size="lg" variant="outline">
              Upload a Photo
            </Button>
          </AddPostDialog>
        </div>
      </section>

       <section className="mb-16">
        <h2 className="font-headline text-4xl font-semibold tracking-tight mb-8 text-center">
          AI-Powered Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureCards.map((feature) => (
            <Link key={feature.href} href={feature.href} className="block group">
              <Card className="h-full flex flex-col transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                <CardHeader className="items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-2">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end justify-center">
                  <Button variant="ghost" className="w-full">
                    {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-headline text-4xl font-semibold tracking-tight mb-8 text-center">
          Recent Moments
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.slice(0, 3).map((photo) => {
            const user = findUser(photo.userId);
            return user && currentUser ? (
              <PhotoCard key={photo.id} photo={photo} user={user} currentUser={currentUser}/>
            ) : null;
          })}
        </div>
        <div className="text-center mt-8">
          <Button variant="ghost" asChild>
            <Link href="/discover">
              See more <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

    

import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Compass,
  FileText,
  Globe,
  Map,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPhotos, getUsers } from '@/lib/mock-data';
import { PhotoCard } from '@/components/wanderlens/photo-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddPostDialog } from '@/components/wanderlens/add-post-dialog';

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
]

export default function Home() {
  const photos = getPhotos();
  const users = getUsers();

  const findUser = (userId: number) => users.find((u) => u.id === userId);

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
              Upload a Photo <Plus />
            </Button>
          </AddPostDialog>
        </div>
      </section>

       <section className="mb-16">
        <h2 className="font-headline text-4xl font-semibold tracking-tight mb-8 text-center">
          AI-Powered Tools
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
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
          {photos.map((photo) => {
            const user = findUser(photo.userId);
            return user ? (
              <PhotoCard key={photo.id} photo={photo} user={user} />
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

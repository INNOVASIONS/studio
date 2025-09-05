import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Compass,
  FileText,
  Globe,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPhotos, getUsers } from '@/lib/mock-data';
import { PhotoCard } from '@/components/wanderlens/photo-card';

export default function Home() {
  const photos = getPhotos().slice(0, 5);
  const users = getUsers();

  const findUser = (userId: number) => users.find((u) => u.id === userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
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
          <Button size="lg" variant="outline">
            Upload a Photo <Plus />
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-headline text-3xl font-semibold tracking-tight mb-6">
          Recent Moments
        </h2>
        <div className="flex flex-col items-center gap-8">
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

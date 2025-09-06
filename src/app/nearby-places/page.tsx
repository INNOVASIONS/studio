import { NearbyPlacesMap } from '@/components/wanderlens/nearby-places-map';

export default function NearbyPlacesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Discover Nearby Restaurants
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore restaurants near you based on your current location.
        </p>
      </div>
      <NearbyPlacesMap />
    </div>
  );
}

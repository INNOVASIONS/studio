'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function NearbyPlacesMap() {
  const [searchQuery, setSearchQuery] = useState('restaurants');
  const [locationQuery, setLocationQuery] = useState('Chennai');
  const [mapUrl, setMapUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateMapUrl = (query: string, place: string) => {
    if (!GOOGLE_API_KEY) {
      setError('Google Maps API Key is missing.');
      return;
    }
    const q = `${query} in ${place}`;
    const url = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(q)}`;
    setMapUrl(url);
  };

  useEffect(() => {
    updateMapUrl(searchQuery, locationQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    updateMapUrl(searchQuery, locationQuery);
    setIsLoading(false);
    toast({
      title: 'Search Complete',
      description: `Showing results for "${searchQuery}" in "${locationQuery}".`,
    });
  };

  const handleFindMyLocation = async () => {
    setIsLoading(true);
    setError(null);
    toast({
      title: 'Locating...',
      description: 'Attempting to find your location.',
    });

    try {
      const res = await fetch('/api/get-accurate-location', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const { lat, lng } = data.location;
      const newLocationQuery = `${lat},${lng}`;
      setLocationQuery(newLocationQuery);
      updateMapUrl(searchQuery, newLocationQuery);
      
      toast({
        title: 'Location Found',
        description: `Map updated. Accuracy: ${data.accuracy.toFixed(2)} meters.`,
      });
    } catch (apiError: any) {
        toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not get your location. Please check permissions or search manually.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (!GOOGLE_API_KEY) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Google Maps API Key Missing</AlertTitle>
        <AlertDescription>
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg p-4 sm:p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="search-query">What to find?</Label>
            <Input 
              id="search-query"
              placeholder="e.g., panipuri, cafe, park"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-query">Where?</Label>
            <Input 
              id="location-query"
              placeholder="e.g., Chennai, or your address"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search /> Search
            </Button>
            <Button onClick={handleFindMyLocation} type="button" variant="secondary" className="w-full" disabled={isLoading}>
              <LocateFixed /> {isLoading ? 'Locating...' : 'My Location'}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl relative flex items-center justify-center bg-muted">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}
        {mapUrl ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={mapUrl}
          ></iframe>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted-foreground font-semibold">Enter a search to load the map.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

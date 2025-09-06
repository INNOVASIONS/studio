'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed, Search, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function NearbyPlacesMap() {
  const [searchQuery, setSearchQuery] = useState('restaurants');
  const [locationQuery, setLocationQuery] = useState('Chennai');
  const [mapUrl, setMapUrl] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateMapUrl = (query: string, place: string) => {
    setIsLoading(true);
    setError(null);
    if (!GOOGLE_API_KEY) {
      setError('key_missing');
      setIsLoading(false);
      return;
    }
    if (!query || !place) {
        setError('query_missing');
        setIsLoading(false);
        return;
    }

    const q = `${query} in ${place}`;
    const url = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(q)}`;
    setMapUrl(url);
    // Note: The iframe's onLoad event will set isLoading to false
  };

  useEffect(() => {
    updateMapUrl(searchQuery, locationQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateMapUrl(searchQuery, locationQuery);
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
      if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch location.');
      }
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
            description: apiError.message || 'Could not get your location. Please check permissions or search manually.',
        });
        setIsLoading(false);
    }
  };

  const ApiKeyErrorCard = () => (
    <Card className="h-full flex items-center justify-center border-destructive bg-destructive/10">
        <CardContent className="text-center p-6">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-destructive">Google Maps Error</h2>
            <p className="text-destructive/80 mt-2">
                The map failed to load. This is usually due to an invalid or restricted API key.
            </p>
            <div className="text-left text-sm mt-4 p-4 bg-background rounded-md border">
                <h3 className="font-semibold mb-2">How to Fix:</h3>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Cloud Console</a>.</li>
                    <li>Ensure the <strong>"Maps Embed API"</strong> is enabled for your project.</li>
                    <li>Check your API key's restrictions. If you have <strong>HTTP referrer restrictions</strong>, make sure your current development domain is allowed.</li>
                    <li>Confirm your project has an active <strong>Billing Account</strong>.</li>
                </ol>
            </div>
        </CardContent>
    </Card>
  )

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

      <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl relative flex items-center justify-center bg-muted">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}
        {error ? (
          <ApiKeyErrorCard />
        ) : (
          <iframe
            key={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={mapUrl}
            onLoad={() => setIsLoading(false)}
            onError={() => {
                setError('iframe_error');
                setIsLoading(false);
            }}
            className="z-10"
          ></iframe>
        )}
      </Card>
    </div>
  );
}

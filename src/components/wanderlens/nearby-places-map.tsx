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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateMapUrl = (query: string, place: string) => {
    if (!GOOGLE_API_KEY) {
      setError('Google Maps API Key is missing.');
      setIsLoading(false);
      return;
    }
    const q = `${query} in ${place}`;
    const url = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(q)}`;
    setMapUrl(url);
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Load the map with a default query on initial render.
    updateMapUrl(searchQuery, locationQuery);
  }, []); // Note: Empty dependency array ensures this runs only once on mount.

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    updateMapUrl(searchQuery, locationQuery);
  };

  const handleFindMyLocation = async () => {
    setIsLoading(true);
    setError(null);
    toast({
      title: 'Locating...',
      description: 'Attempting to find your location using our accurate service.',
    });

    try {
      const res = await fetch('/api/get-accurate-location', { method: 'POST' });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.location) {
        const newLocation = `${data.location.lat},${data.location.lng}`;
        setLocationQuery(newLocation);
        updateMapUrl(searchQuery, newLocation);
        toast({
          title: 'Location Found',
          description: `Map updated. Accuracy: ${data.accuracy.toFixed(2)} meters.`,
        });
      } else {
        throw new Error("The location API did not return a valid location.");
      }
    } catch (apiError: any) {
      setError(`Primary location service failed: ${apiError.message}. Trying browser's fallback...`);
      toast({
          variant: 'destructive',
          title: 'Primary Service Failed',
          description: `Trying backup location service...`,
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = `${position.coords.latitude},${position.coords.longitude}`;
            setLocationQuery(newLocation);
            updateMapUrl(searchQuery, newLocation);
            setError(null); // Clear previous error
            toast({
              title: 'Location Found (Fallback)',
              description: 'Map updated using your browser\'s location service.',
            });
          },
          (err) => {
            const message = 'All location services failed. Please check browser permissions and network, or search for a location manually.';
            setError(message);
            toast({
              variant: 'destructive',
              title: 'Location Error',
              description: message,
            });
            // Fallback to default if all else fails
            updateMapUrl(searchQuery, 'Chennai');
          }
        );
      } else {
        const message = 'Geolocation is not supported by this browser. Please search for a location manually.';
        setError(message);
        toast({
            variant: 'destructive',
            title: 'Unsupported Browser',
            description: message,
        });
        updateMapUrl(searchQuery, 'Chennai');
      }
    } finally {
      // In many cases, setIsLoading(false) is handled by the functions called within,
      // but a final check ensures we don't stay in a loading state.
      // The Geolocation API is async, so we might need to wait.
      // A simple timeout can work, or we handle it in each branch.
      // For now, it's handled in updateMapUrl and the error callbacks.
    }
  };

  if (!GOOGLE_API_KEY) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Google Maps API Key Missing</AlertTitle>
        <AlertDescription>
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file to use this feature.
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
              {isLoading && mapUrl ? <Loader2 className="animate-spin" /> : <Search />}
              Search
            </Button>
            <Button onClick={handleFindMyLocation} type="button" variant="secondary" className="w-full" disabled={isLoading}>
              {isLoading && !mapUrl ? <Loader2 className="animate-spin" /> : <LocateFixed />}
              {isLoading && !mapUrl ? 'Locating...' : 'My Location'}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Location Notice</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl relative flex items-center justify-center bg-muted">
        {isLoading ? (
          <div className="text-center p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">Loading map...</p>
          </div>
        ) : mapUrl ? (
          <iframe
            key={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          ></iframe>
        ) : (
           <div className="text-center p-4 text-muted-foreground">
             <Terminal className="h-12 w-12 mx-auto mb-4" />
             <p className="font-semibold">Map could not be loaded.</p>
             <p>Please check your API key and network connection.</p>
           </div>
        )}
      </Card>
      
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>How It Works</AlertTitle>
        <AlertDescription>
          Enter what you want to find and where. Use the "My Location" button to search near you. The map will update with your search results.
        </AlertDescription>
      </Alert>
    </div>
  );
}
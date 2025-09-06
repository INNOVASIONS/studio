'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_LOCATION = { lat: 13.0827, lng: 80.2707 }; // Chennai

export function NearbyPlacesMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number }>(DEFAULT_LOCATION);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const generateMapUrl = useCallback((loc: { lat: number; lng: number }) => {
    if (apiKey) {
      const mapQuery = `q=restaurants&center=${loc.lat},${loc.lng}`;
      return `https://www.google.com/maps/embed/v1/search?key=${apiKey}&${mapQuery}`;
    }
    return '';
  }, [apiKey]);
  
  const getLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Showing a default location.');
      setLocation(DEFAULT_LOCATION);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        toast({
          title: 'Location Found',
          description: 'Map updated with restaurants near you.',
        });
        setIsLoading(false);
      },
      (err) => {
        let message = 'Could not get your location. Showing results for a default location.';
        if (err.code === 1) { // PERMISSION_DENIED
          message = 'Location access was denied. Please enable it in your browser settings. Showing results for a default location.';
        }
        setError(message);
        setLocation(DEFAULT_LOCATION); // Fallback to default
        setIsLoading(false);
         toast({
          variant: "destructive",
          title: 'Location Error',
          description: message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [toast]);
  
  // Effect to generate map URL whenever location changes
  useEffect(() => {
    setMapUrl(generateMapUrl(location));
  }, [location, generateMapUrl]);

  // Effect to get initial location on mount
  useEffect(() => {
    getLocation();
  }, [getLocation]);


  if (!apiKey) {
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
    <div className="space-y-4">
      {error && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Location Notice</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl relative flex items-center justify-center bg-muted">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
            <div className="text-center p-4 rounded-lg shadow-lg">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-semibold">Finding your location...</p>
              <p className="text-xs text-muted-foreground mt-2">
                Please allow location access when prompted.
              </p>
            </div>
          </div>
        )}
        
        {mapUrl ? (
          <iframe
              key={mapUrl} // Re-renders iframe when URL changes
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
              className="z-10"
          ></iframe>
        ) : (
           !isLoading && (
             <div className="text-center p-4">
               <Alert variant="destructive">
                 <AlertTitle>Map Could Not Load</AlertTitle>
                 <AlertDescription>There was an error loading the map. Please try again.</AlertDescription>
               </Alert>
             </div>
           )
        )}
        
        <div className="absolute top-4 right-4 z-20">
          <Button
            onClick={getLocation}
            variant="secondary"
            className="shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            {isLoading ? 'Locating...' : 'Retry My Location'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

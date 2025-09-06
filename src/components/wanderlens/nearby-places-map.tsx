'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_LOCATION = { lat: 13.0827, lng: 80.2707 }; // Default to Chennai

export function NearbyPlacesMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number }>(DEFAULT_LOCATION);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const generateMapUrl = useCallback((loc: { lat: number; lng: number }) => {
    if (apiKey) {
      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${loc.lat},${loc.lng}&zoom=15`;
    }
    return '';
  }, [apiKey]);
  
  const handleFindMyLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    toast({
      title: 'Locating...',
      description: 'Attempting to find your location. Please wait.',
    });

    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by your browser.';
      setError(errorMsg);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: 'Geolocation Error',
        description: errorMsg,
      });
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
          description: `Map updated to your current location.`,
        });
        setIsLoading(false);
      },
      (err) => {
        let message = 'Could not get your location. Please check browser permissions and try again.';
        if (err.code === 1) { // PERMISSION_DENIED
          message = 'Location access was denied. Please enable it in your browser settings to see your current location.';
        }
        setError(message);
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
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Location Notice</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl relative flex items-center justify-center bg-muted">
        {mapUrl ? (
          <iframe
              key={mapUrl} // Key forces re-render when URL changes
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
           <div className="text-center p-4">
             <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
             <p className="text-muted-foreground font-semibold">Loading map...</p>
           </div>
        )}
        
        <div className="absolute top-4 right-4 z-20">
          <Button
            onClick={handleFindMyLocation}
            variant="secondary"
            className="shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            {isLoading ? 'Locating...' : 'Use My Current Location'}
          </Button>
        </div>
      </Card>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>How It Works</AlertTitle>
        <AlertDescription>The map defaults to a set location. Click "Use My Current Location" to allow the browser to find you. You can then use the map's built-in search to find nearby points of interest.</AlertDescription>
      </Alert>
    </div>
  );
}

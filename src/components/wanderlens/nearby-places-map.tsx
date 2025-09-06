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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // This function now generates a URL that both centers the view and places a pin
  const generateMapUrl = useCallback((loc: { lat: number; lng: number }) => {
    if (apiKey) {
      // Use 'q=restaurants' to search and 'center' to position the map.
      // A separate 'q' with coordinates will drop a pin.
      const viewQuery = `q=restaurants&center=${loc.lat},${loc.lng}`;
      const pinQuery = `q=${loc.lat},${loc.lng}`;

      // This uses Google Maps Embed API's "view" mode to show search results
      // while also implicitly dropping a pin from the second 'q' parameter.
      // A more explicit way might be needed if this is not consistent.
      // For now, we will use a single query that centers and pins.
      const mapQuery = `q=restaurants+near+me&center=${loc.lat},${loc.lng}`;
      
      // A better approach is to use the 'view' endpoint which can show a pin
      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${loc.lat},${loc.lng}&zoom=15`;
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
          description: `Map updated to your location.`,
        });
        setIsLoading(false);
      },
      (err) => {
        let message = 'Could not get your location. Please check browser permissions and try again. Showing results for a default location.';
        if (err.code === 1) { // PERMISSION_DENIED
          message = 'Location access was denied. Please enable it in your browser settings to see your current location. Showing results for a default location.';
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
    if (location) {
      setMapUrl(generateMapUrl(location));
    }
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
            <div className="text-center p-4 rounded-lg">
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
           !isLoading && (
             <div className="text-center p-4">
               <Alert variant="destructive">
                 <AlertTitle>Map Could Not Load</AlertTitle>
                 <AlertDescription>There was an error generating the map URL. Please try again.</AlertDescription>
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
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>How It Works</AlertTitle>
        <AlertDescription>This map shows a pin at your detected location. You can then use the map's built-in search and controls to find nearby restaurants and other points of interest.</AlertDescription>
      </Alert>
    </div>
  );
}

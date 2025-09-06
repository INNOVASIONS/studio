'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_LOCATION = { lat: 13.0827, lng: 80.2707 }; // Chennai

export function NearbyPlacesMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapUrl, setMapUrl] = useState<string>('');
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const buildMapUrl = useCallback((loc: { lat: number; lng: number }) => {
    if (apiKey) {
      const mapQuery = `q=restaurants&center=${loc.lat},${loc.lng}`;
      return `https://www.google.com/maps/embed/v1/search?key=${apiKey}&${mapQuery}`;
    }
    return '';
  }, [apiKey]);
  
  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Defaulting to a preset location.');
      setLocation(DEFAULT_LOCATION);
      setLoading(false);
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
          description: 'Showing restaurants near you.',
        });
        setLoading(false);
      },
      (err) => {
        let message = 'Could not get your precise location. Defaulting to a preset location.';
        if (err.code === 1) { // PERMISSION_DENIED
          message = 'Location access was denied. Please enable it in your browser settings to continue. Defaulting to a preset location.';
        }
        setError(message);
        setLocation(DEFAULT_LOCATION);
        setLoading(false);
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

  useEffect(() => {
    getLocation();
  }, [getLocation]);
  
  useEffect(() => {
    if (location) {
        setMapUrl(buildMapUrl(location));
    }
  }, [location, buildMapUrl]);


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
      {error && !loading && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Location Notice</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl relative flex items-center justify-center bg-muted">
        {loading || !mapUrl ? (
          <div className="z-10 text-center p-4 bg-background/80 rounded-lg shadow-lg">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">Locating you and loading map...</p>
            <p className="text-xs text-muted-foreground mt-2">
              Please allow location access when prompted.
            </p>
          </div>
        ) : (
          <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
          ></iframe>
        )}
        <div className="absolute top-4 right-4">
          <Button
            onClick={getLocation}
            variant="secondary"
            className="shadow-lg"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            {loading ? 'Locating...' : 'Retry My Location'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

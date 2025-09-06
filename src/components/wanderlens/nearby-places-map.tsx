'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_LOCATION = { lat: 13.0827, lng: 80.2707 }; // Default to Chennai
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function NearbyPlacesMap() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [mapUrl, setMapUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Immediately set the map to the default location on mount
    const url = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_API_KEY}&q=restaurants&center=${DEFAULT_LOCATION.lat},${DEFAULT_LOCATION.lng}&zoom=14`;
    setMapUrl(url);
  }, []);

  useEffect(() => {
    // Update map URL whenever location changes
    const url = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_API_KEY}&q=restaurants&center=${location.lat},${location.lng}&zoom=14`;
    setMapUrl(url);
  }, [location]);

  const handleFindMyLocation = async () => {
    setIsLoading(true);
    setError(null);
    toast({
      title: 'Locating...',
      description: 'Attempting to find your location using a more accurate service.',
    });

    try {
      const res = await fetch('/api/get-accurate-location', { method: 'POST' });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.location) {
        const newLocation = {
          lat: data.location.lat,
          lng: data.location.lng,
        };
        setLocation(newLocation);
        toast({
          title: 'Location Found',
          description: `Map updated. Accuracy: ${data.accuracy.toFixed(2)} meters.`,
        });
      } else {
        // Fallback to browser geolocation if API fails to return location
        throw new Error("API did not return a location. Trying browser's service.");
      }
    } catch (apiError: any) {
      setError(`Google API failed: ${apiError.message}. Trying browser's service...`);
      toast({
          variant: 'destructive',
          title: 'Primary Service Failed',
          description: `Trying backup location service...`,
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setLocation(newLocation);
            setIsLoading(false);
            setError(null);
            toast({
              title: 'Location Found (Fallback)',
              description: 'Map updated using browser location.',
            });
          },
          (err) => {
            const message = 'Both location services failed. Please check browser permissions and network connection.';
            setError(message);
            setIsLoading(false);
            toast({
              variant: 'destructive',
              title: 'Location Error',
              description: message,
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        const message = 'Geolocation is not supported by your browser.';
        setError(message);
        setIsLoading(false);
        toast({
            variant: 'destructive',
            title: 'Unsupported',
            description: message,
        });
      }
    } finally {
      // Only set loading to false if not handled by async browser geolocation
      if (navigator.geolocation) {
          // The geolocation callback will handle setting isLoading to false
      } else {
          setIsLoading(false);
      }
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
          <div className="text-center p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">Loading map...</p>
          </div>
        )}
        <div className="absolute top-4 right-4 z-20">
          <Button onClick={handleFindMyLocation} variant="secondary" className="shadow-lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            {isLoading ? 'Locating...' : 'Find My Location'}
          </Button>
        </div>
      </Card>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>How It Works</AlertTitle>
        <AlertDescription>
          The map defaults to Chennai. Click "Find My Location" to use Google's advanced location service to find you.
        </AlertDescription>
      </Alert>
    </div>
  );
}

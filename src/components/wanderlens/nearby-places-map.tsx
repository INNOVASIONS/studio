'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export function NearbyPlacesMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    // Not resetting location to null here to avoid the "world map" flash.
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Showing a default location.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
        toast({
            title: "Location Found",
            description: "Showing restaurants near you.",
        })
      },
      (err) => {
        let message = `Could not get your precise location. Defaulting to a preset location.`;
        if (err.code === 1) { // PERMISSION_DENIED
            message = "Location access was denied. Please enable it in your browser settings to find nearby places. Defaulting to a preset location."
        }
        setError(message);
        // Do not set location to null here, so it keeps the default if it exists
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  }, [toast]);

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
  
  const mapQuery = location 
    ? `q=restaurants&center=${location.lat},${location.lng}`
    : `q=restaurants+in+chennai`;

  return (
    <div className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        )}
        <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl relative">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className='text-center'>
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Trying to access your location...</p>
                        <p className="text-xs text-muted-foreground mt-2">Please allow location access when prompted.</p>
                    </div>
                </div>
            )}
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/search?key=${apiKey}&${mapQuery}`}
            ></iframe>
            <div className="absolute top-4 right-4">
                <Button onClick={getLocation} variant="secondary" className="shadow-lg" disabled={loading}>
                    <LocateFixed className="mr-2"/>
                    Retry My Location
                </Button>
            </div>
        </Card>
    </div>
  );
}

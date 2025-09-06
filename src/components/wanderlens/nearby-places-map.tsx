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
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
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
        let message = `Error getting location: ${err.message}.`;
        if (err.code === 1) { // PERMISSION_DENIED
            message = "Location access was denied. Please enable it in your browser settings to find nearby places."
        }
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000, // Increased timeout for better accuracy
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
          It looks like the Google Maps API key is not configured correctly. Please add it to your .env file as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. You may need to restart the development server for the change to take effect.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
        <Card className="shadow-lg w-full h-[600px] flex items-center justify-center">
            <div className='text-center'>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Trying to access your location...</p>
                <p className="text-xs text-muted-foreground mt-2">Please allow location access when prompted.</p>
            </div>
        </Card>
    )
  }

  if (error) {
     return (
        <Card className="shadow-lg w-full h-[600px] flex items-center justify-center">
             <div className='text-center max-w-md mx-auto'>
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Could Not Get Location</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
                <Button onClick={getLocation} className="mt-4">
                    <LocateFixed className="mr-2"/>
                    Try Again
                </Button>
            </div>
        </Card>
    )
  }

  if (!location) {
    // This state should ideally not be reached if loading and error are handled,
    // but it's good practice as a fallback.
    return (
        <Card className="shadow-lg w-full h-[600px] flex items-center justify-center">
            <p className="text-muted-foreground">Something went wrong. Please try again.</p>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=restaurants&center=${location.lat},${location.lng}&zoom=14`}
      ></iframe>
    </Card>
  );
}

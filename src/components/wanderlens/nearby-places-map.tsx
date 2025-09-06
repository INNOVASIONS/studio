'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed } from 'lucide-react';
import { Button } from '../ui/button';

export function NearbyPlacesMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const getLocation = () => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

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
                <p className="text-muted-foreground">Fetching your location...</p>
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
                    <AlertTitle>Location Access Denied</AlertTitle>
                    <AlertDescription>
                        {error}. Please enable location services in your browser settings to see nearby restaurants.
                    </AlertDescription>
                </Alert>
                <Button onClick={getLocation} className="mt-4">
                    <LocateFixed className="mr-2"/>
                    Retry
                </Button>
            </div>
        </Card>
    )
  }

  if (!location) {
    return null;
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
        src={`https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=restaurants+in&center=${location.lat},${location.lng}&zoom=14`}
      ></iframe>
    </Card>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function NearbyPlacesMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Google Maps API Key Missing</AlertTitle>
            <AlertDescription>
                Please add your Google Maps API key to the .env file as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to see the map.
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <Card className="shadow-lg w-full h-[600px] overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/search?q=restaurants+in+India&key=${apiKey}`}
        allowFullScreen
      ></iframe>
    </Card>
  );
}

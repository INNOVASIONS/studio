'use client';

import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function NearbyPlacesMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Google Maps API Key Missing</AlertTitle>
            <AlertDescription>
                It looks like the Google Maps API key is not configured correctly. Please add it to your .env file as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. You may need to restart the development server for the change to take effect.
            </AlertDescription>
        </Alert>
    )
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
        src={`https://www.google.com/maps/embed/v1/search?q=restaurants+in+India&key=${apiKey}`}
      ></iframe>
    </Card>
  );
}

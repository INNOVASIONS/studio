'use client';

import { Card } from '@/components/ui/card';

export function NearbyPlacesMap() {
  return (
    <Card className="shadow-lg w-full h-[600px] overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/search?q=restaurants+in+India&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        allowFullScreen
      ></iframe>
    </Card>
  );
}

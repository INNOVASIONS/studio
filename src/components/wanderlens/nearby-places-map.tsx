'use client';

import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, LocateFixed, Search, PlusCircle, Hotel, Utensils } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { getUserPlaces, UserPlace } from '@/lib/mock-data';
import { AddPlaceForm } from './add-place-form';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 13.0827,
  lng: 80.2707,
};

export function NearbyPlacesMap() {
  const [searchQuery, setSearchQuery] = useState('restaurants');
  const [locationQuery, setLocationQuery] = useState('Chennai');
  const [mapUrl, setMapUrl] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(12);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [userPlaces, setUserPlaces] = useState<UserPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<UserPlace | null>(null);
  const [isAddPlaceFormOpen, setIsAddPlaceFormOpen] = useState(false);
  const [newPlaceLocation, setNewPlaceLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    setUserPlaces(getUserPlaces());
    updateMapUrl(searchQuery, locationQuery);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY!,
  });

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setNewPlaceLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setIsAddPlaceFormOpen(true);
    }
  }, []);
  
  const handleAddPlace = (newPlace: Omit<UserPlace, 'id' | 'lat' | 'lng'>) => {
    if (newPlaceLocation) {
        const placeWithLocation = { ...newPlace, ...newPlaceLocation };
        // In a real app, this would be an API call.
        // For now, just updating local state for immediate feedback.
        setUserPlaces(prev => [...prev, { ...placeWithLocation, id: Date.now() }]);
        setIsAddPlaceFormOpen(false);
        setNewPlaceLocation(null);
        toast({
            title: 'Place Added!',
            description: `${newPlace.name} has been added to the map.`,
        });
    }
  };

  const updateMapUrl = (query: string, place: string) => {
    if (!GOOGLE_API_KEY) {
      setError('Google Maps API Key is missing.');
      return;
    }
    const q = `${query} in ${place}`;
    const url = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(q)}`;
    setMapUrl(url);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    updateMapUrl(searchQuery, locationQuery);
    
    // Simple geocoding simulation to move the map
    // In a real app, use the Geocoding API
    if (locationQuery.toLowerCase() === 'chennai') {
        setMapCenter(defaultCenter);
        setZoom(12);
    } 
    setIsLoading(false);
  };

  const handleFindMyLocation = async () => {
    setIsLoading(true);
    setError(null);
    toast({
      title: 'Locating...',
      description: 'Attempting to find your location.',
    });

    try {
      const res = await fetch('/api/get-accurate-location', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const { lat, lng } = data.location;
      setLocationQuery(`${lat},${lng}`);
      setMapCenter({ lat, lng });
      setZoom(15);
      updateMapUrl(searchQuery, `${lat},${lng}`);
      
      toast({
        title: 'Location Found',
        description: `Map updated. Accuracy: ${data.accuracy.toFixed(2)} meters.`,
      });
    } catch (apiError: any) {
        toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not get your location. Please check permissions or search manually.',
        });
    } finally {
        setIsLoading(false);
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
    <div className="space-y-6">
      <Card className="shadow-lg p-4 sm:p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="search-query">What to find?</Label>
            <Input 
              id="search-query"
              placeholder="e.g., panipuri, cafe, park"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-query">Where?</Label>
            <Input 
              id="location-query"
              placeholder="e.g., Chennai, or your address"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search /> Search
            </Button>
            <Button onClick={handleFindMyLocation} type="button" variant="secondary" className="w-full" disabled={isLoading}>
              <LocateFixed /> {isLoading ? 'Locating...' : 'My Location'}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg w-full h-[600px] overflow-hidden rounded-xl relative flex items-center justify-center bg-muted">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            onClick={onMapClick}
            onCenterChanged={() => {
                // To prevent infinite loops with state updates, we don't set center here
            }}
          >
            {userPlaces.map(place => (
                <Marker 
                    key={place.id}
                    position={{ lat: place.lat, lng: place.lng }}
                    onClick={() => setSelectedPlace(place)}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: place.type === 'Restaurant' ? '#ea4335' : '#4285f4',
                        fillOpacity: 1,
                        strokeWeight: 0,
                        scale: 8,
                    }}
                />
            ))}
            {selectedPlace && (
                <InfoWindow
                    position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                    onCloseClick={() => setSelectedPlace(null)}
                >
                    <div className="p-1 max-w-xs">
                        <h4 className="font-bold text-md flex items-center">
                           {selectedPlace.type === 'Restaurant' ? <Utensils className="mr-2 h-4 w-4"/> : <Hotel className="mr-2 h-4 w-4"/>}
                           {selectedPlace.name}
                        </h4>
                        <p className="text-sm mt-1">{selectedPlace.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">Added by: {selectedPlace.addedBy}</p>
                    </div>
                </InfoWindow>
            )}
            {newPlaceLocation && <Marker position={newPlaceLocation} />}
          </GoogleMap>
        ) : (
          <div className="text-center p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">Loading map...</p>
          </div>
        )}
      </Card>
      
      <Alert>
        <PlusCircle className="h-4 w-4" />
        <AlertTitle>Add to the Map!</AlertTitle>
        <AlertDescription>
          Click anywhere on the map to add a new hotel, restaurant, or point of interest. Your contributions help everyone discover new places!
        </AlertDescription>
      </Alert>
      <AddPlaceForm 
        isOpen={isAddPlaceFormOpen}
        onClose={() => setIsAddPlaceFormOpen(false)}
        onSubmit={handleAddPlace}
      />
    </div>
  );
}

'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleFindLocation, LocationState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Globe, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import React, { useState } from 'react';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Globe className="mr-2" />
          Find Location
        </>
      )}
    </Button>
  );
}

export function LocationFinderForm() {
  const initialState: LocationState = {};
  const [state, dispatch] = useActionState(handleFindLocation, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPreview(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Identify a Location</CardTitle>
          <CardDescription>
            Upload a photo and let our AI determine its geographical coordinates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div>
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="file:text-accent file:font-semibold"
              />
               <input type="hidden" name="photoDataUri" value={preview || ''} />
            </div>
             {preview && (
              <div className="mt-4 rounded-md overflow-hidden border">
                <Image src={preview} alt="Image preview" width={500} height={300} className="w-full object-cover" />
              </div>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {state?.error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}
        {state?.latitude !== undefined && state?.longitude !== undefined ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Location Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Latitude</span>
                <span className="font-mono text-lg font-semibold">{state.latitude.toFixed(6)}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Longitude</span>
                <span className="font-mono text-lg font-semibold">{state.longitude.toFixed(6)}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-mono text-lg font-semibold">{((state.confidence || 0) * 100).toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        ) : (
            <Card className="flex flex-col items-center justify-center h-full min-h-[300px] border-dashed">
                <CardContent className="text-center text-muted-foreground">
                    <Globe className="mx-auto h-12 w-12 mb-4" />
                    <p className="font-semibold">Coordinates will appear here.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}

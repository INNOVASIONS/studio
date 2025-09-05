'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerateItinerary, ItineraryState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Wand2 className="mr-2" />
          Generate Itinerary
        </>
      )}
    </Button>
  );
}

export function ItineraryForm() {
  const initialState: ItineraryState = {};
  const [state, dispatch] = useActionState(handleGenerateItinerary, initialState);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Plan Your Trip</CardTitle>
          <CardDescription>
            Describe your dream destination and travel style, and let our AI create a personalized itinerary for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="e.g., Kyoto, Japan"
                required
              />
            </div>
            <div>
              <Label htmlFor="preferences">Preferences</Label>
              <Textarea
                id="preferences"
                name="preferences"
                placeholder="e.g., 5-day trip, interested in temples, gardens, local food, and photography spots. Budget-friendly."
                required
                rows={5}
              />
            </div>
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
        {state?.itinerary ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Custom Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {state.itinerary}
              </div>
            </CardContent>
          </Card>
        ) : (
            <Card className="flex flex-col items-center justify-center h-full min-h-[300px] border-dashed">
                <CardContent className="text-center text-muted-foreground">
                    <Wand2 className="mx-auto h-12 w-12 mb-4" />
                    <p className="font-semibold">Your generated itinerary will appear here.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}

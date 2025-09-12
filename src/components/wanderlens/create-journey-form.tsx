'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '../ui/separator';

export function CreateJourneyForm() {

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Journey Details</CardTitle>
            <CardDescription>
                Fill in the details below to create your travel journey.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="place-visited">Place Visited</Label>
                        <Input id="place-visited" name="place-visited" placeholder="e.g., Paris, France" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trip-duration">Trip Duration (days)</Label>
                        <Input id="trip-duration" name="trip-duration" type="number" placeholder="e.g., 7" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="travelers">Number of Travelers</Label>
                        <Input id="travelers" name="travelers" type="number" placeholder="e.g., 2" required />
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-lg font-medium mb-4">Transport Details</h3>
                    <p className="text-sm text-muted-foreground">Transport form fields will go here.</p>
                </div>

                <Separator />

                 <div>
                    <h3 className="text-lg font-medium mb-4">Hotel Details</h3>
                    <p className="text-sm text-muted-foreground">Hotel form fields will go here.</p>
                </div>

                <Separator />

                 <div>
                    <h3 className="text-lg font-medium mb-4">Visited Places</h3>
                    <p className="text-sm text-muted-foreground">A repeatable section for visited places with photos will go here.</p>
                </div>


                <Button type="submit" className="w-full">Create Journey</Button>
            </form>
        </CardContent>
    </Card>
  );
}

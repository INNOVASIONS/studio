
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Car, Hotel, Plane, Ship, Train } from 'lucide-react';

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
                    <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="transport-mode">Mode of Transport</Label>
                            <Select>
                                <SelectTrigger id="transport-mode">
                                    <SelectValue placeholder="Select transport type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plane"><Plane className="inline-block mr-2" /> Plane</SelectItem>
                                    <SelectItem value="train"><Train className="inline-block mr-2" /> Train</SelectItem>
                                    <SelectItem value="car"><Car className="inline-block mr-2" /> Car</SelectItem>
                                    <SelectItem value="ship"><Ship className="inline-block mr-2" /> Ship/Ferry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transport-cost">Transport Cost (total)</Label>
                            <Input id="transport-cost" name="transport-cost" type="number" placeholder="e.g., 500" />
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <Label htmlFor="transport-details">Transport Notes</Label>
                        <Textarea id="transport-details" name="transport-details" placeholder="e.g., 'Flew with Emirates, great service. Took a rental car from the airport.'" />
                    </div>
                </div>

                <Separator />

                 <div>
                    <h3 className="text-lg font-medium mb-4">Hotel Details</h3>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="hotel-name">Hotel Name</Label>
                            <Input id="hotel-name" name="hotel-name" placeholder="e.g., The Grand Budapest Hotel" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="hotel-photos">Hotel Photos</Label>
                            <Input id="hotel-photos" name="hotel-photos" type="file" multiple />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hotel-duration">Duration of Stay (nights)</Label>
                            <Input id="hotel-duration" name="hotel-duration" type="number" placeholder="e.g., 6" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hotel-cost">Hotel Cost (total)</Label>
                            <Input id="hotel-cost" name="hotel-cost" type="number" placeholder="e.g., 1200" />
                        </div>
                     </div>
                     <div className="mt-4 space-y-2">
                        <Label htmlFor="hotel-review">Hotel Review</Label>
                        <Textarea id="hotel-review" name="hotel-review" placeholder="e.g., 'Amazing hotel with a great view, friendly staff, and a delicious breakfast.'" />
                    </div>
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

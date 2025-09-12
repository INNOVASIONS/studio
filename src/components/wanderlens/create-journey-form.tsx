
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Car, Hotel, Plane, Ship, Train, PlusCircle, XCircle, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type VisitedPlace = {
  name: string;
  photos: FileList | null;
  description: string;
};

export function CreateJourneyForm() {
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([{ name: '', photos: null, description: '' }]);
  const [date, setDate] = useState<Date>();

  const handleAddPlace = () => {
    setVisitedPlaces([...visitedPlaces, { name: '', photos: null, description: '' }]);
  };

  const handleRemovePlace = (index: number) => {
    const newPlaces = visitedPlaces.filter((_, i) => i !== index);
    setVisitedPlaces(newPlaces);
  };

  const handlePlaceChange = (index: number, field: keyof VisitedPlace, value: string | FileList | null) => {
    const newPlaces = [...visitedPlaces];
    if (field === 'photos' && value instanceof FileList) {
      newPlaces[index][field] = value;
    } else if (typeof value === 'string') {
        (newPlaces[index] as any)[field] = value;
    }
    setVisitedPlaces(newPlaces);
  };

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
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="place-visited">Place Visited</Label>
                        <Input id="place-visited" name="place-visited" placeholder="e.g., Paris, France" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
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
                    <h3 className="text-lg font-medium mb-2">Visited Places</h3>
                    <div className="space-y-6">
                        {visitedPlaces.map((place, index) => (
                            <div key={index} className="space-y-4 border p-4 rounded-md relative bg-muted/20">
                                <h4 className="font-semibold">Stop #{index + 1}</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor={`place-name-${index}`}>Place Name</Label>
                                        <Input
                                            id={`place-name-${index}`}
                                            value={place.name}
                                            onChange={(e) => handlePlaceChange(index, 'name', e.target.value)}
                                            placeholder="e.g., Eiffel Tower"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`place-photos-${index}`}>Photos</Label>
                                        <Input
                                            id={`place-photos-${index}`}
                                            type="file"
                                            multiple
                                            onChange={(e) => handlePlaceChange(index, 'photos', e.target.files)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`place-description-${index}`}>Description</Label>
                                    <Textarea
                                        id={`place-description-${index}`}
                                        value={place.description}
                                        onChange={(e) => handlePlaceChange(index, 'description', e.target.value)}
                                        placeholder="Briefly describe your experience here..."
                                    />
                                </div>
                                {visitedPlaces.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleRemovePlace(index)}
                                    >
                                        <XCircle className="h-5 w-5" />
                                        <span className="sr-only">Remove Place</span>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                     <Button type="button" variant="outline" onClick={handleAddPlace} className="mt-4">
                        <PlusCircle className="mr-2" />
                        Add Another Place
                    </Button>
                </div>


                <Button type="submit" className="w-full">Create Journey</Button>
            </form>
        </CardContent>
    </Card>
  );
}

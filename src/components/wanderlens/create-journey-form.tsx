
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Car, Hotel, Plane, Ship, Train, PlusCircle, XCircle, CalendarIcon, Bus, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format, eachDayOfInterval } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { handleCreateJourney, CreateJourneyState } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { RupeeIcon } from './rupee-icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

type VisitedPlace = {
  name: string;
  description: string;
};

type DailyActivityState = {
    day: number;
    date: Date;
    places: VisitedPlace[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        'Create Journey'
      )}
    </Button>
  );
}

const currencies = [
  { value: 'USD', label: 'USD - United States Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'SEK', label: 'SEK - Swedish Krona' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar' },
  { value: 'KRW', label: 'KRW - South Korean Won' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'NOK', label: 'NOK - Norwegian Krone' },
  { value: 'MXN', label: 'MXN - Mexican Peso' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
];

const AutoRickshawIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        fill="currentColor"
        width="1em"
        height="1em"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M16.984375 6.9863281 A 1.0001 1.0001 0 0 0 16.841797 7L9 7C4.0414839 7 0 11.041484 0 16L0 18.832031 A 1.0001 1.0001 0 0 0 0 19.158203L0 23L0 24L0 33C0 35.209 1.791 37 4 37L4.0410156 37C4.0272801 37.166874 4 37.332921 4 37.5C4 38.847222 4.4436807 40.207881 5.3769531 41.257812C6.3102255 42.307744 7.7500005 43 9.5 43C11.249999 43 12.689774 42.307744 13.623047 41.257812C14.556319 40.207881 15 38.847222 15 37.5C15 37.332921 14.97272 37.166874 14.958984 37L32.085938 37L44.925781 27.013672L44.943359 26.998047C44.881359 25.661047 44.758797 24.385922 44.591797 23.169922C44.584797 23.114922 44.580266 23.055 44.572266 23L44.564453 23C43.597218 16.173862 41.207756 11.336942 39.828125 9L43 9 A 1.0001 1.0001 0 1 0 43 7L17.167969 7 A 1.0001 1.0001 0 0 0 16.984375 6.9863281 z M 9 9L16 9L16 18L2 18L2 16C2 12.122516 5.1225161 9 9 9 z M 18 9L30 9L30 25.5C30 28.533 27.532 31 24.5 31L22 31L22 28C22 25.585637 20.279096 23.566404 18 23.101562L18 19.167969 A 1.0001 1.0001 0 0 0 18 18.841797L18 9 z M 35 9L37.462891 9C38.128719 9.9710703 41.050765 14.526735 42.373047 22L35 22L35 9 z M 2 20L16 20L16 23L2 23L2 20 z M 45.919922 28.773438L36.628906 36L38.234375 36C38.096218 36.47937 38 36.976318 38 37.5C38 40.533 40.468 43 43.5 43C46.532 43 49 40.533 49 37.5C49 36.979775 48.922717 36.477329 48.787109 36L49 36C49.3 36 49.583438 35.866766 49.773438 35.634766C49.962438 35.403766 50.039469 35.098687 49.980469 34.804688C49.297469 31.384687 47.356922 29.629437 45.919922 28.773438 z M 40.351562 36L46.648438 36C46.866983 36.456487 47 36.961001 47 37.5C47 39.43 45.43 41 43.5 41C41.57 41 40 39.43 40 37.5C40 36.961001 40.133017 36.456487 40.351562 36 z M 6.0429688 37L12.957031 37C12.978067 37.165983 13 37.331532 13 37.5C13 38.402778 12.69368 39.292119 12.126953 39.929688C11.560226 40.567256 10.749999 41 9.5 41C8.2500008 41 7.4397738 40.567256 6.8730469 39.929688C6.3063199 39.292119 6 38.402778 6 37.5C6 37.331532 6.0219328 37.165983 6.0429688 37 z"></path>
    </svg>
);

const initialPlace = { name: '', description: '' };

export function CreateJourneyForm() {
  const { toast } = useToast();
  const initialState: CreateJourneyState = {};
  const [state, dispatch] = useActionState(handleCreateJourney, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [dailyActivities, setDailyActivities] = useState<DailyActivityState[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    if (startDate && endDate && endDate >= startDate) {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const newDailyActivities: DailyActivityState[] = days.map((date, i) => {
        const existingDay = dailyActivities.find(d => format(d.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        return existingDay || { day: i + 1, date, places: [initialPlace] };
      });
      setDailyActivities(newDailyActivities);
    } else {
      setDailyActivities([]);
    }
  }, [startDate, endDate]);


  const handleAddPlace = (dayIndex: number) => {
    const newDailyActivities = [...dailyActivities];
    newDailyActivities[dayIndex].places.push(initialPlace);
    setDailyActivities(newDailyActivities);
  };

  const handleRemovePlace = (dayIndex: number, placeIndex: number) => {
    const newDailyActivities = [...dailyActivities];
    newDailyActivities[dayIndex].places = newDailyActivities[dayIndex].places.filter((_, i) => i !== placeIndex);
    setDailyActivities(newDailyActivities);
  };

  const handlePlaceChange = (dayIndex: number, placeIndex: number, field: 'name' | 'description', value: string) => {
    const newDailyActivities = [...dailyActivities];
    newDailyActivities[dayIndex].places[placeIndex] = {
        ...newDailyActivities[dayIndex].places[placeIndex],
        [field]: value,
    };
    setDailyActivities(newDailyActivities);
  };
  
  useEffect(() => {
    if (state.success) {
      toast({
        title: "Journey Created!",
        description: "Your new travel journey has been successfully saved.",
      });
      formRef.current?.reset();
      setStartDate(undefined);
      setEndDate(undefined);
      setDailyActivities([]);
    }
  }, [state, toast]);


  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Journey Details</CardTitle>
            <CardDescription>
                Fill in the details below to create your travel journey.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form action={dispatch} ref={formRef} className="space-y-6">
                <input 
                    type="hidden" 
                    name="daily-activities-data" 
                    value={JSON.stringify(dailyActivities.map(day => ({
                        ...day,
                        date: day.date.toISOString(),
                    })))} 
                />
                 <input type="hidden" name="start-date" value={startDate?.toISOString() ?? ''} />
                 <input type="hidden" name="end-date" value={endDate?.toISOString() ?? ''} />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
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
                                    !startDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                disabled={(date) =>
                                    endDate ? date > endDate : false
                                }
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                disabled={(date) =>
                                    startDate ? date < startDate : false
                                }
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2 lg:col-span-3">
                        <Label htmlFor="travelers">Number of Travelers</Label>
                        <Input id="travelers" name="travelers" type="number" placeholder="e.g., 2" required min="1" />
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-lg font-medium mb-4">Transport Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="transport-mode">Mode of Transport</Label>
                            <Select name="transport-mode">
                                <SelectTrigger id="transport-mode">
                                    <SelectValue placeholder="Select transport type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plane"><Plane className="inline-block mr-2" /> Plane</SelectItem>
                                    <SelectItem value="train"><Train className="inline-block mr-2" /> Train</SelectItem>
                                    <SelectItem value="car"><Car className="inline-block mr-2" /> Car</SelectItem>
                                    <SelectItem value="bus"><Bus className="inline-block mr-2" /> Bus</SelectItem>
                                    <SelectItem value="auto-rickshaw"><AutoRickshawIcon className="inline-block mr-2" /> Auto-rickshaw</SelectItem>
                                    <SelectItem value="ship"><Ship className="inline-block mr-2" /> Ship/Ferry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-2">
                                <Label htmlFor="transport-currency">Currency</Label>
                                <Select name="transport-currency">
                                    <SelectTrigger id="transport-currency">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <ScrollArea className="h-60">
                                        {currencies.map((c) => (
                                        <SelectItem key={c.value} value={c.value}>
                                           <div className="flex items-center gap-2">
                                            {c.value === 'INR' ? <RupeeIcon /> : null} {c.label.split(' - ')[0]}
                                           </div>
                                        </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="transport-cost">Transport Cost</Label>
                                <Input id="transport-cost" name="transport-cost" type="number" placeholder="e.g., 500" />
                            </div>
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
                         <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-2">
                                <Label htmlFor="hotel-currency">Currency</Label>
                                <Select name="hotel-currency">
                                    <SelectTrigger id="hotel-currency">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <ScrollArea className="h-60">
                                        {currencies.map((c) => (
                                        <SelectItem key={c.value} value={c.value}>
                                          <div className="flex items-center gap-2">
                                            {c.value === 'INR' ? <RupeeIcon /> : null} {c.label.split(' - ')[0]}
                                           </div>
                                        </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hotel-cost">Hotel Cost</Label>
                                <Input id="hotel-cost" name="hotel-cost" type="number" placeholder="e.g., 1200" />
                            </div>
                        </div>
                     </div>
                     <div className="mt-4 space-y-2">
                        <Label htmlFor="hotel-review">Hotel Review</Label>
                        <Textarea id="hotel-review" name="hotel-review" placeholder="e.g., 'Amazing hotel with a great view, friendly staff, and a delicious breakfast.'" />
                    </div>
                </div>

                <Separator />
                
                 <div>
                    <h3 className="text-lg font-medium mb-2">Daily Itinerary</h3>
                    {dailyActivities.length > 0 ? (
                        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['day-0']}>
                            {dailyActivities.map((day, dayIndex) => (
                                <AccordionItem key={dayIndex} value={`day-${dayIndex}`} className="border-none">
                                    <AccordionTrigger className="flex w-full items-center justify-between rounded-md bg-muted/50 px-4 py-3 text-lg font-semibold text-primary hover:no-underline">
                                        Day {day.day}: {format(day.date, 'PPP')}
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                                        <div className="space-y-6">
                                            {day.places.map((place, placeIndex) => (
                                                <div key={placeIndex} className="space-y-4 border p-4 rounded-md relative bg-background">
                                                    <h4 className="font-semibold">Stop #{placeIndex + 1}</h4>
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`day-${dayIndex}-place-${placeIndex}-name`}>Place Name</Label>
                                                            <Input
                                                                id={`day-${dayIndex}-place-${placeIndex}-name`}
                                                                value={place.name}
                                                                onChange={(e) => handlePlaceChange(dayIndex, placeIndex, 'name', e.target.value)}
                                                                placeholder="e.g., Eiffel Tower"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`day-${dayIndex}-place-${placeIndex}-photos`}>Photos</Label>
                                                            <Input
                                                                id={`day-${dayIndex}-place-${placeIndex}-photos`}
                                                                name={`day-${dayIndex}-place-${placeIndex}-photos`}
                                                                type="file"
                                                                multiple
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`day-${dayIndex}-place-${placeIndex}-description`}>Description</Label>
                                                        <Textarea
                                                            id={`day-${dayIndex}-place-${placeIndex}-description`}
                                                            value={place.description}
                                                            onChange={(e) => handlePlaceChange(dayIndex, placeIndex, 'description', e.target.value)}
                                                            placeholder="Briefly describe your experience here..."
                                                        />
                                                    </div>
                                                    {day.places.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                                            onClick={() => handleRemovePlace(dayIndex, placeIndex)}
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                            <span className="sr-only">Remove Place</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                             <Button type="button" variant="outline" onClick={() => handleAddPlace(dayIndex)} className="mt-4">
                                                <PlusCircle className="mr-2" />
                                                Add Stop to Day {day.day}
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                           <p>Please select a start and end date to begin planning your itinerary.</p>
                        </div>
                    )}
                </div>

                {state?.error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error Creating Journey</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                <SubmitButton />
            </form>
        </CardContent>
    </Card>
  );
}

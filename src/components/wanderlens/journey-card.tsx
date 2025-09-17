
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Journey, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Users, Plane, Train, Car, Ship, Bus, Hotel, MapPin, Wallet, BookOpen, Heart, MessageCircle, Expand } from 'lucide-react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

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

const transportIcons: { [key: string]: React.ElementType } = {
  plane: Plane,
  train: Train,
  car: Car,
  ship: Ship,
  bus: Bus,
  'auto-rickshaw': AutoRickshawIcon,
};

const ImageCarousel = ({ images, alt }: { images: string[], alt: string }) => {
    if (!images || images.length === 0) return null;
    
    return (
         <Carousel className="w-full" opts={{loop: true}}>
            <CarouselContent>
                {images.map((src, index) => (
                    <CarouselItem key={index}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="bg-muted relative group cursor-pointer aspect-video overflow-hidden">
                                    <Image src={src} alt={`${alt} photo ${index + 1}`} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Expand className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                            </DialogTrigger>
                             <DialogContent className="max-w-4xl p-0">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Enlarged photo: {alt}</DialogTitle>
                                    <DialogDescription>A larger view of the journey image.</DialogDescription>
                                </DialogHeader>
                                <Image src={src} alt={alt} width={1600} height={900} className="w-full h-auto object-contain rounded-lg" />
                            </DialogContent>
                        </Dialog>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {images.length > 1 && (
                <>
                    <CarouselPrevious className="ml-12" />
                    <CarouselNext className="mr-12"/>
                </>
            )}
        </Carousel>
    )
}

export function JourneyCard({ journey, user }: { journey: Journey, user: User }) {
  const [isLiked, setIsLiked] = useState(false);
  
  const allPhotos = [
    ...(journey.hotelPhotos || []),
    ...journey.dailyActivities.flatMap(day =>
      day.places.flatMap(place => place.photos || [])
    ),
  ];
  const TransportIcon = (journey.transportMode && transportIcons[journey.transportMode]) || Car;


  const formatDateRange = () => {
    if (!journey.startDate || !journey.endDate) return 'Date not specified';
    // The browser's timezone can be inconsistent.
    // By assuming the user's local timezone for parsing, we avoid hydration errors
    // where the server (UTC) and client (local) would render different days.
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedStartDate = toZonedTime(new Date(journey.startDate), timeZone);
    const zonedEndDate = toZonedTime(new Date(journey.endDate), timeZone);

    return `${format(zonedStartDate, 'd MMM yyyy')} - ${format(zonedEndDate, 'd MMM yyyy')}`;
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    // In a real app, you'd also update the like count on the server
  };

  return (
    <Card className="w-full max-w-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/profile/${user.id}`}>
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link href={`/profile/${user.id}`} className="font-semibold hover:underline text-sm">
            {user.name}
          </Link>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1 text-accent" />
            <span>{journey.placeVisited}</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <time className="text-xs text-muted-foreground">
              {formatDateRange()}
            </time>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
          {allPhotos.length > 0 ? (
             <ImageCarousel images={allPhotos} alt={`Photos from ${journey.placeVisited}`} />
          ) : (
             <div className="aspect-video bg-muted flex flex-col items-center justify-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mb-2" />
                <p>A journey by {user.name}</p>
             </div>
          )}
      </CardContent>
      
      <div className="p-4 space-y-2">
        <p className="text-sm">
           A {journey.dailyActivities.length}-day journey to <strong>{journey.placeVisited}</strong> with {journey.travelers} {journey.travelers > 1 ? 'travelers' : 'traveler'}.
        </p>
      </div>
      
       <div className="px-4 pb-2">
          <Accordion type="multiple" className="w-full">
             <AccordionItem value="details">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                   <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent" />
                       Journey Details & Itinerary
                   </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-4 pt-4">

                {journey.transportDetails && (
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2 text-foreground"><TransportIcon className="h-4 w-4 text-primary"/>Transport</h4>
                        <p className="pl-6">{journey.transportDetails}</p>
                        {journey.transportCost && journey.transportCurrency && (
                            <p className="pl-6 flex items-center gap-2 text-xs"><Wallet className="h-3 w-3"/>~{journey.transportCurrency} {journey.transportCost}</p>
                        )}
                    </div>
                )}
                
                {journey.hotelName && (
                     <div className="space-y-2">
                         <h4 className="font-semibold flex items-center gap-2 text-foreground"><Hotel className="h-4 w-4 text-primary"/>Accommodation</h4>
                         <div className="pl-6 space-y-2">
                           <p>Stayed at <strong>{journey.hotelName}</strong> for {journey.hotelDuration} {journey.hotelDuration && journey.hotelDuration > 1 ? 'nights' : 'night'}.</p>
                           {journey.hotelReview && <p>"{journey.hotelReview}"</p>}
                           {journey.hotelCost && journey.hotelCurrency && (
                                <p className="flex items-center gap-2 text-xs"><Wallet className="h-3 w-3"/>~{journey.hotelCurrency} {journey.hotelCost} / night</p>
                            )}
                         </div>
                    </div>
                )}

                {journey.dailyActivities && journey.dailyActivities.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2 text-foreground"><Calendar className="h-4 w-4 text-primary"/>Daily Log</h4>
                        <Accordion type="multiple" className="w-full space-y-2 pl-2">
                            {journey.dailyActivities.map((day, dayIndex) => (
                                <AccordionItem key={dayIndex} value={`day-${dayIndex}`} className="border-none">
                                    <AccordionTrigger className="flex w-full items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-xs font-semibold text-primary/80 hover:no-underline">
                                        Day {day.day}: {format(new Date(day.date), 'MMMM do')}
                                    </AccordionTrigger>
                                    <AccordionContent className="p-2 space-y-2">
                                        {day.places.map((place, placeIndex) => (
                                            place.name && <div key={placeIndex} className="p-2 rounded-md border bg-background/50 space-y-2">
                                                <h5 className="font-semibold flex items-center gap-2 text-foreground"><MapPin className="h-4 w-4 text-accent"/>{place.name}</h5>
                                                {place.description && <p className="text-xs text-muted-foreground pl-6">{place.description}</p>}
                                            </div>
                                        ))}
                                        {day.places.length === 0 || (day.places.length === 1 && !day.places[0].name) ? (
                                            <p className='text-xs text-muted-foreground text-center py-2'>No specific stops logged for this day.</p>
                                        ): null}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                 )}

                </AccordionContent>
             </AccordionItem>
          </Accordion>
       </div>

      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 group" onClick={handleLikeClick}>
            <Heart className={cn("h-5 w-5 text-accent transition-all group-hover:scale-110", isLiked && "fill-accent")} />
            <span>{(journey.id * 13) % 100}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 group">
              <MessageCircle className="h-5 w-5 text-accent transition-all group-hover:scale-110" />
              <span>{(journey.id * 7) % 100}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

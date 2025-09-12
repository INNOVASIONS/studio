
'use client';

import type { Journey, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Users, Plane, Train, Car, Ship, Bus, Hotel, MapPin, Wallet, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

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

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-center gap-3 text-sm">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
            <p className="font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    </div>
);

const DetailSection = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <div>
        <h4 className="font-headline text-lg mb-2 flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/>{title}</h4>
        <div className="text-sm text-muted-foreground pl-7 space-y-2">{children}</div>
    </div>
)


export function JourneyCard({ journey, user }: { journey: Journey, user: User }) {
  const TransportIcon = journey.transportMode ? transportIcons[journey.transportMode] : Car;

  const formatDateRange = () => {
    if (!journey.startDate || !journey.endDate) return 'N/A';
    return `${format(new Date(journey.startDate), 'LLL d, yyyy')} - ${format(new Date(journey.endDate), 'LLL d, yyyy')}`;
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg overflow-hidden">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl text-primary">{journey.placeVisited}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>Journey by {user.name}</span>
                </CardDescription>
            </div>
            <div className="text-right flex-shrink-0">
                <InfoItem icon={Calendar} label="Date" value={formatDateRange()} />
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
            <InfoItem icon={Users} label="Travelers" value={journey.travelers} />
            {journey.transportMode && <InfoItem icon={TransportIcon} label="Transport" value={journey.transportMode.charAt(0).toUpperCase() + journey.transportMode.slice(1)} />}
            {journey.hotelName && <InfoItem icon={Hotel} label="Stayed at" value={journey.hotelName} />}
        </div>
        <div className="md:col-span-2 space-y-6">
            {journey.transportDetails && (
                <DetailSection title="Transport Notes" icon={TransportIcon}>
                    <p>{journey.transportDetails}</p>
                     {journey.transportCost && journey.transportCurrency && (
                        <p className="flex items-center gap-2"><Wallet className="h-4 w-4"/>~{journey.transportCurrency} {journey.transportCost}</p>
                    )}
                </DetailSection>
            )}
            {journey.hotelReview && (
                 <DetailSection title="Hotel Review" icon={Hotel}>
                    <p>"{journey.hotelReview}"</p>
                    {journey.hotelCost && journey.hotelCurrency && (
                        <p className="flex items-center gap-2 pt-2"><Wallet className="h-4 w-4"/>~{journey.hotelCurrency} {journey.hotelCost} / night</p>
                    )}
                </DetailSection>
            )}
        </div>
      </CardContent>
      {journey.visitedPlaces && journey.visitedPlaces.length > 0 && (
          <CardFooter className="p-0">
            <Accordion type="single" collapsible className="w-full bg-muted/20">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="px-4 md:px-6 py-3 font-headline text-lg hover:no-underline">
                        <div className="flex items-center gap-2">
                           <BookOpen className="h-5 w-5 text-primary"/>
                            Stops & Stories ({journey.visitedPlaces.length})
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 md:p-6 pt-0">
                        <div className="space-y-4">
                            {journey.visitedPlaces.map((place, index) => (
                                <div key={index} className="p-3 rounded-md border bg-background">
                                    <h5 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-accent"/>{place.name}</h5>
                                    <p className="text-sm text-muted-foreground pl-6">{place.description}</p>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          </CardFooter>
      )}
    </Card>
  );
}

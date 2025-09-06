import Image from 'next/image';
import Link from 'next/link';
import {
  Car,
  Heart,
  MapPin,
  MessageCircle,
  UtensilsCrossed,
} from 'lucide-react';
import type { Photo, User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type PhotoCardProps = {
  photo: Photo;
  user: User;
};

export function PhotoCard({ photo, user }: PhotoCardProps) {
  const hasDetails = photo.transportDetails || photo.foodDetails;

  return (
    <Card className="w-full max-w-2xl overflow-hidden shadow-lg">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href="/profile">
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link
            href="/profile"
            className="font-semibold hover:underline text-sm"
          >
            {user.name}
          </Link>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1 text-accent" />
            <span>{photo.location}</span>
          </div>
        </div>
        <time className="ml-auto text-xs text-muted-foreground">
          {photo.timestamp}
        </time>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-muted">
          <Image
            src={photo.imageUrl}
            alt={photo.caption}
            width={1000}
            height={600}
            className="w-full h-auto object-cover"
            data-ai-hint={photo.dataAiHint}
          />
        </div>
      </CardContent>
      <div className="p-4 space-y-2">
        <p className="text-sm">{photo.caption}</p>
      </div>

      {hasDetails && (
        <div className="px-4 pb-2">
          <Accordion type="multiple" className="w-full">
            {photo.transportDetails && (
              <AccordionItem value="transport">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-accent" />
                    Transport Tips
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {photo.transportDetails}
                </AccordionContent>
              </AccordionItem>
            )}
            {photo.foodDetails && (
              <AccordionItem value="food">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-accent" />
                    Food Recommendations
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {photo.foodDetails}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}

      <CardFooter className="p-4 border-t">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" />
            <span>{photo.likes.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-accent" />
            <span>{photo.comments.toLocaleString()}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

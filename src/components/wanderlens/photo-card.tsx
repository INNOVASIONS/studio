
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Car,
  Heart,
  MapPin,
  MessageCircle,
  Star,
  UtensilsCrossed,
  Wallet,
  Expand,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type PhotoCardProps = {
  photo: Photo;
  user: User;
};

const StarRatingDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < rating ? 'text-accent fill-accent' : 'text-gray-300'
        )}
      />
    ))}
  </div>
);

const CostDisplay = ({ cost, currency }: { cost: number; currency?: string }) => (
    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
        <Wallet className="h-4 w-4 text-accent" />
        <span>~{currency}{cost.toFixed(2)} per person</span>
    </div>
);

export function PhotoCard({ photo, user }: PhotoCardProps) {
  const hasDetails = photo.transportDetails || photo.foodDetails;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(photo.likes);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
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
          <Link
            href={`/profile/${user.id}`}
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
        <Dialog>
          <DialogTrigger asChild>
            <div className="bg-muted relative group cursor-pointer">
              <Image
                src={photo.imageUrl}
                alt={photo.caption}
                width={1000}
                height={600}
                className="w-full h-auto object-cover"
                data-ai-hint={photo.dataAiHint}
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Expand className="h-10 w-10 text-white" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0">
            <Image
              src={photo.imageUrl}
              alt={photo.caption}
              width={1600}
              height={900}
              className="w-full h-auto object-contain rounded-lg"
            />
          </DialogContent>
        </Dialog>
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
                    {photo.transportRating && (
                      <StarRatingDisplay rating={photo.transportRating} />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-3">
                  {photo.transportDetails}
                  {photo.transportCost && (
                      <CostDisplay cost={photo.transportCost} currency={photo.currency} />
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
            {photo.foodDetails && (
              <AccordionItem value="food">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-accent" />
                    Food Recommendations
                    {photo.foodRating && (
                      <StarRatingDisplay rating={photo.foodRating} />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-3">
                  {photo.foodDetails}
                  {photo.foodCost && (
                        <CostDisplay cost={photo.foodCost} currency={photo.currency} />
                    )}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}

      <CardFooter className="p-4 border-t">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 group" onClick={handleLikeClick}>
            <Heart className={cn("h-5 w-5 text-accent transition-all group-hover:scale-110", isLiked && "fill-accent")} />
            <span>{likeCount.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 group">
            <MessageCircle className="h-5 w-5 text-accent transition-all group-hover:scale-110" />
            <span>{photo.comments.toLocaleString()}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

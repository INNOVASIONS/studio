import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import type { Photo, User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type PhotoCardProps = {
  photo: Photo;
  user: User;
};

export function PhotoCard({ photo, user }: PhotoCardProps) {
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
          <Link href="/profile" className="font-semibold hover:underline">
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
        <div className="aspect-w-16 aspect-h-9 bg-muted">
          <Image
            src={photo.imageUrl}
            alt={photo.caption}
            width={1000}
            height={600}
            className="w-full h-auto object-cover"
            data-ai-hint={photo.dataAiHint}
          />
        </div>
        <p className="p-4 text-sm">{photo.caption}</p>
      </CardContent>
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

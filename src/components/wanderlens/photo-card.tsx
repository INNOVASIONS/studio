
'use client';

import { useState, useTransition, useEffect } from 'react';
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
  Send,
  Loader2,
  Languages,
  Bed,
  Building,
  Ticket,
  Trash2,
} from 'lucide-react';
import type { Photo, User, Comment } from '@/lib/types';
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
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { handleTranslatePost, TranslationState, handleDeletePost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { LanguageDialog } from './language-dialog';


const CommentsDialog = ({
  photo,
  children,
  currentUser,
}: {
  photo: Photo;
  children: React.ReactNode;
  currentUser: User;
}) => {
  const [comments, setComments] = useState<Comment[]>(photo.comments);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const commentToAdd: Comment = {
      id: Math.random(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      },
      text: newComment.trim(),
      timestamp: 'Just now',
    };

    setComments(prev => [...prev, commentToAdd]);
    setNewComment('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            See what people are saying about this post.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6 border-y">
          <div className="p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                    />
                    <AvatarFallback>
                      {comment.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold">{comment.user.name}</span>{' '}
                      <span className="text-muted-foreground">
                        {comment.text}
                      </span>
                    </p>
                    <time className="text-xs text-muted-foreground">
                      {comment.timestamp}
                    </time>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center gap-2 w-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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

const CostDisplay = ({ cost, currency, label = "per person" }: { cost?: number; currency?: string, label?: string }) => {
    if (cost === undefined || !currency) {
        return null;
    }
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
            <Wallet className="h-4 w-4 text-accent" />
            <span>~{currency} {cost.toLocaleString()} {label}</span>
        </div>
    )
};


export function PhotoCard({ photo, user, currentUser, onPostDeleted }: { photo: Photo, user: User, currentUser: User, onPostDeleted: (photoId: number) => void }) {
  const hasDetails = photo.transportDetails || photo.foodDetails || photo.hotelDetails || photo.entryFeeCost;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(photo.likes);
  const { toast } = useToast();

  const [isTranslated, setIsTranslated] = useState(false);
  const [translation, setTranslation] = useState<TranslationState | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLangDialogVisible, setLangDialogVisible] = useState(false);
  
  const isOwner = user.id === currentUser.id;

  const onTranslate = (targetLanguage: string) => {
    if (!targetLanguage) return;
    setLangDialogVisible(false);

    startTransition(async () => {
      const rating = photo.foodRating && photo.transportRating ? (photo.foodRating + photo.transportRating)/2 : (photo.foodRating || photo.transportRating);

      const result = await handleTranslatePost({
        targetLanguage,
        caption: photo.caption,
        transportDetails: photo.transportDetails,
        foodDetails: photo.foodDetails,
        hotelDetails: photo.hotelDetails,
        restaurantName: photo.restaurantName,
        hotelName: photo.hotelName,
        rating,
        transportCost: photo.transportCost,
        foodCost: photo.foodCost,
        hotelCost: photo.hotelCost,
        currency: photo.currency,
        transportName: photo.transportName,
      });

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Translation Failed',
          description: result.error,
        });
        return;
      }
      setTranslation(result);
      setIsTranslated(true);
      setLangDialogVisible(false);
    });
  };

  const caption = isTranslated ? translation?.translatedCaption : photo.caption;
  const transportDetails = isTranslated ? translation?.translatedTransportDetails : photo.transportDetails;
  const foodDetails = isTranslated ? translation?.translatedFoodDetails : photo.foodDetails;
  const hotelDetails = isTranslated ? translation?.translatedHotelDetails : photo.hotelDetails;


  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };
  
  const handleTranslateClick = () => {
    if (isTranslated) {
      setIsTranslated(false);
      setTranslation(null);
    } else {
      setLangDialogVisible(true);
    }
  };

  const [isDeletePending, startDeleteTransition] = useTransition();

  const onDeletePost = () => {
    startDeleteTransition(async () => {
      const result = await handleDeletePost(photo.id, currentUser.id);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Deletion Failed',
          description: result.error,
        });
      } else {
        toast({
          title: 'Post Deleted',
          description: 'Your post has been successfully removed.',
        });
        onPostDeleted(photo.id);
      }
    });
  };

  const TranslateButton = () => (
     <Button onClick={handleTranslateClick} variant="ghost" size="sm" className="text-muted-foreground" disabled={isPending}>
        {isPending ? (
            <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Translating...
            </>
        ) : isTranslated ? (
            'See Original'
        ) : (
            <>
                <Languages className="h-4 w-4 mr-2" />
                Translate
            </>
        )}
    </Button>
  )

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
        <div className="ml-auto flex items-center gap-2">
            <time className="text-xs text-muted-foreground">
            {photo.timestamp}
            </time>
             {isOwner && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your post and remove its data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDeletePost} disabled={isDeletePending}>
                                {isDeletePending ? <Loader2 className="animate-spin" /> : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>

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
             <DialogHeader className="sr-only">
                <DialogTitle>Enlarged photo: {photo.caption}</DialogTitle>
                <DialogDescription>A larger view of the post image.</DialogDescription>
            </DialogHeader>
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
        <p className="text-sm">{caption}</p>
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
                  {photo.transportName && <p className='font-semibold text-foreground flex items-center gap-2'><Car className='h-4 w-4'/>{photo.transportName}</p>}
                  <p>{transportDetails}</p>
                  <CostDisplay cost={photo.transportCost} currency={photo.currency} />
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
                   {photo.restaurantName && <p className='font-semibold text-foreground flex items-center gap-2'><Building className='h-4 w-4'/>{photo.restaurantName}</p>}
                  <p>{foodDetails}</p>
                   <CostDisplay cost={photo.foodCost} currency={photo.currency} />
                </AccordionContent>
              </AccordionItem>
            )}
            {photo.hotelDetails && (
              <AccordionItem value="hotel">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-accent" />
                    Hotel Details
                    {photo.hotelRating && (
                      <StarRatingDisplay rating={photo.hotelRating} />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-3">
                   {photo.hotelName && <p className='font-semibold text-foreground flex items-center gap-2'><Building className='h-4 w-4'/>{photo.hotelName}</p>}
                  <p>{hotelDetails}</p>
                   <CostDisplay cost={photo.hotelCost} currency={photo.currency} label="per night" />
                </AccordionContent>
              </AccordionItem>
            )}
            {photo.entryFeeCost && (
              <AccordionItem value="entry-fee">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-accent" />
                    Attraction / Entry Fee
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-3">
                   {photo.attractionName && <p className='font-semibold text-foreground flex items-center gap-2'><MapPin className='h-4 w-4'/>{photo.attractionName}</p>}
                   <CostDisplay cost={photo.entryFeeCost} currency={photo.currency} />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}

      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 group" onClick={handleLikeClick}>
            <Heart className={cn("h-5 w-5 text-accent transition-all group-hover:scale-110", isLiked && "fill-accent")} />
            <span>{likeCount.toLocaleString()}</span>
          </Button>
          <CommentsDialog photo={photo} currentUser={currentUser}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 group">
              <MessageCircle className="h-5 w-5 text-accent transition-all group-hover:scale-110" />
              <span>{photo.comments.length.toLocaleString()}</span>
            </Button>
          </CommentsDialog>
        </div>
        
        <LanguageDialog
          open={isLangDialogVisible}
          onOpenChange={setLangDialogVisible}
          onSelectLanguage={onTranslate}
          isPending={isPending}
        />

        <TranslateButton />

      </CardFooter>
    </Card>
  );
}


'use client';

import React, { useState, useRef, useContext } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Star, FilePlus2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '../ui/switch';
import { RupeeIcon } from './rupee-icon';
import { addPhoto, getCurrentUser } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { NotificationContext } from '@/context/notification-context';

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="p-0 bg-transparent border-none"
        >
          <Star
            className={cn(
              'w-5 h-5 cursor-pointer',
              star <= rating ? 'text-accent fill-accent' : 'text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );
};

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

export function AddPostDialog({
  children,
  onPostCreated,
}: {
  children: React.ReactNode;
  onPostCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [transportRating, setTransportRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [hotelRating, setHotelRating] = useState(0);
  const [currency, setCurrency] = useState('');
  const [showHotelDetails, setShowHotelDetails] = useState(false);
  const [showEntryFee, setShowEntryFee] = useState(false);
  const { toast } = useToast();
  const { addNotification } = useContext(NotificationContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const resetForm = () => {
    setPreview(null);
    setTransportRating(0);
    setFoodRating(0);
    setHotelRating(0);
    setShowHotelDetails(false);
    setShowEntryFee(false);
    setCurrency('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const photoDataUri = preview;
    const caption = formData.get('caption') as string;
    const location = formData.get('location') as string;

    if (!photoDataUri || !caption || !location) {
      setError('Photo, caption, and location are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      
      const newPost = await addPhoto({
        userId: currentUser.id,
        imageUrl: photoDataUri,
        caption,
        location,
        currency: currency || undefined,
        transportDetails: formData.get('transportDetails') as string || undefined,
        foodDetails: formData.get('foodDetails') as string || undefined,
        hotelDetails: formData.get('hotelDetails') as string || undefined,
        restaurantName: formData.get('restaurantName') as string || undefined,
        hotelName: formData.get('hotelName') as string || undefined,
        transportName: formData.get('transportName') as string || undefined,
        transportRating: transportRating || undefined,
        foodRating: foodRating || undefined,
        hotelRating: hotelRating || undefined,
        transportCost: parseFloat(formData.get('transportCost') as string) || undefined,
        foodCost: parseFloat(formData.get('foodCost') as string) || undefined,
        hotelCost: parseFloat(formData.get('hotelCost') as string) || undefined,
        attractionName: formData.get('attractionName') as string || undefined,
        entryFeeCost: parseFloat(formData.get('entryFeeCost') as string) || undefined,
      });

      toast({
        title: "Post Created!",
        description: "Your new post has been successfully shared.",
      });

      addNotification({
        user: currentUser,
        action: 'created a new post.',
        time: 'Just now',
        icon: FilePlus2,
        iconClass: 'text-primary'
      });

      onPostCreated?.();
      setOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form when dialog is closed
  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your latest travel moment with the community.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
          <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>

            {preview && (
              <div className="mt-4 rounded-md overflow-hidden border aspect-video bg-muted flex items-center justify-center">
                <Image
                  src={preview}
                  alt="Image preview"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                name="caption"
                placeholder="e.g., 'A beautiful sunset over the ocean.'"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., 'Bali, Indonesia'"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency-select">Currency (Optional)</Label>
              <Select onValueChange={setCurrency} name="currency">
                <SelectTrigger id="currency-select">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center gap-2">
                        {c.value === 'INR' ? <RupeeIcon /> : null} {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                    <Label>Transport Details (Optional)</Label>
                    <StarRating rating={transportRating} setRating={setTransportRating} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="transportName">Transport Name/Number</Label>
                    <Input id="transportName" name="transportName" placeholder="e.g., 'Bus 7H', 'Metro Line 2'" />
                </div>
                <Textarea
                    id="transportDetails"
                    name="transportDetails"
                    placeholder="e.g., 'Rented a scooter to get here. Best way to explore!'"
                />
                <div className="space-y-2">
                    <Label htmlFor="transportCost">Transport Cost (Optional)</Label>
                    <Input id="transportCost" name="transportCost" type="number" step="0.01" placeholder="e.g., 25.50" />
                </div>
            </div>

            <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                    <Label>Food Details (Optional)</Label>
                    <StarRating rating={foodRating} setRating={setFoodRating} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="restaurantName">Restaurant Name</Label>
                    <Input id="restaurantName" name="restaurantName" placeholder="e.g., 'The Gilded Spoon'" />
                </div>
                <Textarea
                    id="foodDetails"
                    name="foodDetails"
                    placeholder="e.g., 'The local warung had the best Nasi Goreng!'"
                />
                <div className="space-y-2">
                    <Label htmlFor="foodCost">Food Cost (Optional)</Label>
                    <Input id="foodCost" name="foodCost" type="number" step="0.01" placeholder="e.g., 12.00" />
                </div>
            </div>

            <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                    <Label htmlFor="hotel-switch">Stayed in a hotel?</Label>
                    <Switch id="hotel-switch" checked={showHotelDetails} onCheckedChange={setShowHotelDetails} />
                </div>
               {showHotelDetails && (
                 <div className='space-y-4'>
                    <div className="flex justify-between items-center">
                        <Label>Hotel Details</Label>
                        <StarRating rating={hotelRating} setRating={setHotelRating} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="hotelName">Hotel Name</Label>
                        <Input id="hotelName" name="hotelName" placeholder="e.g., 'The Grand Palace'" />
                    </div>
                    <Textarea
                        id="hotelDetails"
                        name="hotelDetails"
                        placeholder="e.g., 'Amazing hotel with a great view and pool!'"
                    />
                    <div className="space-y-2">
                        <Label htmlFor="hotelCost">Hotel Cost (per night)</Label>
                        <Input id="hotelCost" name="hotelCost" type="number" step="0.01" placeholder="e.g., 150.00" />
                    </div>
                 </div>
               )}
            </div>

            <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                    <Label htmlFor="entry-fee-switch">Paid an Entry Fee?</Label>
                    <Switch id="entry-fee-switch" checked={showEntryFee} onCheckedChange={setShowEntryFee} />
                </div>
               {showEntryFee && (
                 <div className='space-y-4'>
                    <div className="space-y-2">
                        <Label htmlFor="attractionName">Attraction/Place Name</Label>
                        <Input id="attractionName" name="attractionName" placeholder="e.g., 'Louvre Museum'" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="entryFeeCost">Entry Fee Cost</Label>
                        <Input id="entryFeeCost" name="entryFeeCost" type="number" step="0.01" placeholder="e.g., 17.00" />
                    </div>
                 </div>
               )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="sticky bottom-0 bg-background pt-4 flex sm:justify-between gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                    Cancel
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                        <Plus className="mr-2" />
                        Create Post
                        </>
                    )}
                </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

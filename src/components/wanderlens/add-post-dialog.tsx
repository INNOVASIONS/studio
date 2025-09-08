
'use client';

import React, { useState, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
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
import { handleCreatePost, CreatePostState } from '@/lib/actions';
import { Loader2, Plus, Star } from 'lucide-react';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Plus className="mr-2" />
          Create Post
        </>
      )}
    </Button>
  );
}

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

export function AddPostDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const initialState: CreatePostState = { message: '' };
  const [state, dispatch] = useActionState(handleCreatePost, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [transportRating, setTransportRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [hotelRating, setHotelRating] = useState(0);
  const [currency, setCurrency] = useState('');
  const [showHotelDetails, setShowHotelDetails] = useState(false);

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

  React.useEffect(() => {
    if (state.success) {
      setOpen(false);
      setPreview(null);
      setTransportRating(0);
      setFoodRating(0);
      setHotelRating(0);
      setShowHotelDetails(false);
      setCurrency('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [state.success]);

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
          <form action={dispatch} ref={formRef} className="space-y-4">
            <input type="hidden" name="transportRating" value={transportRating} />
            <input type="hidden" name="foodRating" value={foodRating} />
            <input type="hidden" name="hotelRating" value={hotelRating} />
            <input type="hidden" name="currency" value={currency} />

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
              <input type="hidden" name="photoDataUri" value={preview || ''} />
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
              <Select onValueChange={setCurrency}>
                <SelectTrigger id="currency-select">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                    <Label htmlFor="transportDetails">Transport Details (Optional)</Label>
                    <StarRating rating={transportRating} setRating={setTransportRating} />
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


            {state?.message && !state.success && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="sticky bottom-0 bg-background pt-4 flex sm:justify-between gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                    Cancel
                    </Button>
                </DialogClose>
                <SubmitButton />
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

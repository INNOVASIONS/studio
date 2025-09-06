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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { handleCreatePost, CreatePostState } from '@/lib/actions';
import { Loader2, Plus, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

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

export function AddPostDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const initialState: CreatePostState = { message: '' };
  const [state, dispatch] = useActionState(handleCreatePost, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [state.success]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your latest travel moment with the community.
          </DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
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
            <Label htmlFor="transportDetails">Transport Details (Optional)</Label>
            <Textarea
              id="transportDetails"
              name="transportDetails"
              placeholder="e.g., 'Rented a scooter to get here. Best way to explore!'"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foodDetails">Food Details (Optional)</Label>
            <Textarea
              id="foodDetails"
              name="foodDetails"
              placeholder="e.g., 'The local warung had the best Nasi Goreng!'"
            />
          </div>

          {state?.message && !state.success && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

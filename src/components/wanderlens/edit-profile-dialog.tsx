
'use client';

import React, { useEffect, useActionState, useRef, useState } from 'react';
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
import { handleUpdateProfile, UpdateProfileState } from '@/lib/actions';
import { Loader2, Save, Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="animate-spin mr-2" />
      ) : (
        <Save className="mr-2" />
      )}
      Save Changes
    </Button>
  );
}

export function EditProfileDialog({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const initialState: UpdateProfileState = {};
  const [state, dispatch] = useActionState(handleUpdateProfile, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
      // Force a reload of the page to reflect header changes
      router.refresh();
    }
    // Reset preview when dialog opens
    if (!open) {
      setAvatarPreview(null);
    }
  }, [state, toast, open, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={dispatch} className="space-y-4 py-4">
          <input type="hidden" name="avatarDataUri" value={avatarPreview || ''} />

          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-muted shadow-md">
                  <AvatarImage src={avatarPreview || user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
            </Label>
            <Input id="avatar-upload" name="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
             <Button type="button" variant="link" size="sm" asChild>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                    Change profile photo
                </Label>
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={user.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="handle">Handle</Label>
            <Input
              id="handle"
              name="handle"
              defaultValue={user.handle}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={user.bio}
              rows={4}
              placeholder="Tell us a little about yourself..."
            />
          </div>
          {state?.error && (
            <Alert variant="destructive">
              <AlertTitle>Update Failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

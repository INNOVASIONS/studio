'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getCurrentUser } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type AddPlaceFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string; description: string; addedBy: string }) => void;
};

export function AddPlaceForm({ isOpen, onClose, onSubmit }: AddPlaceFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Restaurant');
  const [description, setDescription] = useState('');
  const currentUser = getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
        alert('Please fill out all fields.');
        return;
    }
    onSubmit({ name, type, description, addedBy: currentUser.name });
    // Reset form
    setName('');
    setType('Restaurant');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Place</DialogTitle>
          <DialogDescription>
            You've discovered somewhere special! Fill out the details below to add it to the map for everyone to see.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="place-name">Place Name</Label>
            <Input
              id="place-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., The Grand Hotel"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup defaultValue="Restaurant" value={type} onValueChange={setType} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Restaurant" id="r1" />
                <Label htmlFor="r1">Restaurant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Hotel" id="r2" />
                <Label htmlFor="r2">Hotel</Label>
              </div>
               <div className="flex items-center space-x-2">
                <RadioGroupItem value="Other" id="r3" />
                <Label htmlFor="r3">Other</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="place-description">Description</Label>
            <Textarea
              id="place-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A cozy spot with great views and even better coffee."
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Place</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

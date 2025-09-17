
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CreateJourneyForm } from '@/components/wanderlens/create-journey-form';
import { getJourneys, getCurrentUser } from '@/lib/mock-data';
import { JourneyCard } from '@/components/wanderlens/journey-card';
import { Separator } from '@/components/ui/separator';
import { Journey, User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function CreateJourneyPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setTimeout(async () => {
          const [journeysData, currentUserData] = await Promise.all([
            getJourneys(),
            getCurrentUser(),
          ]);
          setJourneys(journeysData);
          setCurrentUser(currentUserData);
          setLoading(false);
        }, 100);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground mt-2">
            Please <Link href="/auth" className="text-primary underline">log in</Link> to create and view journeys.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Create Your Journey
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Document your travels in detail, from the places you stayed to the sights you saw.
        </p>
      </div>
      <CreateJourneyForm />

      <Separator className="my-12" />

      <div className="space-y-8">
        <div className="text-center">
            <h2 className="font-headline text-4xl font-bold tracking-tight text-primary">
            Your Journeys
            </h2>
            <p className="mt-2 text-md text-muted-foreground max-w-2xl mx-auto">
            A collection of all the wonderful trips you've documented.
            </p>
        </div>

        {journeys.length > 0 ? (
            <div className="flex flex-col items-center space-y-8">
            {journeys.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} user={currentUser} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="text-xl">You haven't created any journeys yet.</p>
                <p>Fill out the form above to start your first travel log!</p>
            </div>
        )}
      </div>
    </div>
  );
}

    
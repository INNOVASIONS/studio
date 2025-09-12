
import { getJourneys, getUsers } from '@/lib/mock-data';
import { JourneyCard } from '@/components/wanderlens/journey-card';
import { getCurrentUser } from '@/lib/mock-data';

export default function JourneysPage() {
  const journeys = getJourneys();
  const currentUser = getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Your Journeys
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of all the wonderful trips you've documented.
        </p>
      </div>

      {journeys.length > 0 ? (
        <div className="space-y-8">
          {journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} user={currentUser} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-xl">You haven't created any journeys yet.</p>
            <p>Go to the "Create Journey" page to start your first travel log!</p>
        </div>
      )}
    </div>
  );
}

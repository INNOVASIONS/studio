import { CreateJourneyForm } from '@/components/wanderlens/create-journey-form';

export default function CreateJourneyPage() {
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
    </div>
  );
}

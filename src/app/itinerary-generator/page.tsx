import { ItineraryForm } from "@/components/wanderlens/itinerary-form";

export default function ItineraryGeneratorPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
                AI Travel Itinerary Generator
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Craft your perfect journey in seconds. Let AI be your personal travel agent.
                </p>
            </div>
            <ItineraryForm />
        </div>
    )
}

import { LocationFinderForm } from "@/components/wanderlens/location-finder-form";

export default function LocationFinderPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
                AI Location Finder
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Ever wonder where a photo was taken? Upload it and find out.
                </p>
            </div>
            <LocationFinderForm />
        </div>
    )
}

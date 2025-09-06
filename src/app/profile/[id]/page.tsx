import { ProfileHeader } from "@/components/wanderlens/profile-header";
import { getUserById, getPhotosByUserId } from "@/lib/mock-data";
import { PhotoCard } from "@/components/wanderlens/photo-card";
import { notFound } from "next/navigation";

export default function ProfilePage({ params }: { params: { id: string } }) {
    const userId = parseInt(params.id, 10);
    const user = getUserById(userId);

    if (!user) {
        notFound();
    }

    const userPhotos = getPhotosByUserId(user.id);

    return(
        <div className="container mx-auto px-4 py-8">
            <ProfileHeader user={user} photosCount={userPhotos.length} />
            
            <div className="mt-12">
                <h2 className="font-headline text-3xl font-semibold tracking-tight mb-6">
                    {user.name.split(' ')[0]}'s Posts
                </h2>
                {userPhotos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userPhotos.map((photo) => (
                            <div key={photo.id} className="flex justify-center">
                                <PhotoCard photo={photo} user={user} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>{user.name} hasn't posted any photos yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

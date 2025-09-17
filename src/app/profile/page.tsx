import { ProfileHeader } from "@/components/wanderlens/profile-header";
import { getCurrentUser, getPhotosByUserId } from "@/lib/mock-data";
import { PhotoCard } from "@/components/wanderlens/photo-card";

export default async function ProfilePage() {
    const currentUser = await getCurrentUser();
    const userPhotos = await getPhotosByUserId(currentUser.id);

    return(
        <div className="container mx-auto px-4 py-8">
            <ProfileHeader user={currentUser} photosCount={userPhotos.length} />
            
            <div className="mt-12">
                <h2 className="font-headline text-3xl font-semibold tracking-tight mb-6">
                    Your Posts
                </h2>
                {userPhotos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userPhotos.map((photo) => (
                            <div key={photo.id} className="flex justify-center">
                                <PhotoCard photo={photo} user={currentUser} currentUser={currentUser} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>You haven't posted any photos yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

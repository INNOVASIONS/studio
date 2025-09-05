import { ProfileHeader } from "@/components/wanderlens/profile-header";
import { getCurrentUser, getPhotosByUserId, getUsers } from "@/lib/mock-data";
import { PhotoCard } from "@/components/wanderlens/photo-card";

export default function ProfilePage() {
    const currentUser = getCurrentUser();
    const userPhotos = getPhotosByUserId(currentUser.id);
    const allUsers = getUsers();

    return(
        <div className="container mx-auto px-4 py-8">
            <ProfileHeader user={currentUser} photosCount={userPhotos.length} />
            
            <div className="mt-12">
                <h2 className="font-headline text-3xl font-semibold tracking-tight mb-6">
                    Your Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userPhotos.map((photo) => (
                        <div key={photo.id} className="flex justify-center">
                            <PhotoCard photo={photo} user={currentUser} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

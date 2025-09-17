
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProfileHeader } from "@/components/wanderlens/profile-header";
import { getCurrentUser, getPhotosByUserId } from "@/lib/mock-data";
import { PhotoCard } from "@/components/wanderlens/photo-card";
import { User, Photo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handlePostDeleted = (photoId: number) => {
      setUserPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                // Use a timeout to ensure localStorage is populated on first load
                setTimeout(async () => {
                    const user = await getCurrentUser();
                    setCurrentUser(user);
                    if (user) {
                        const photos = await getPhotosByUserId(user.id);
                        setUserPhotos(photos);
                    } else {
                        // If no user is found in session, redirect to auth page
                        router.push('/auth');
                    }
                    setLoading(false);
                }, 100);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
                router.push('/auth'); // Redirect on error
            }
        }
        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-6 w-32" />
                        <div className="flex gap-6">
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-20" />
                        </div>
                    </div>
                </div>
                 <div className="mt-12">
                    <Skeleton className="h-8 w-40 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
                    </div>
                </div>
            </div>
        );
    }
    
    if (!currentUser) {
        return (
         <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
           <div className="text-center">
               <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
               <h2 className="text-2xl font-semibold">Loading Profile...</h2>
               <p className="text-muted-foreground mt-2">
                   Please <Link href="/auth" className="text-primary underline">log in</Link> to view your profile.
               </p>
           </div>
         </div>
        )
     }

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
                                <PhotoCard photo={photo} user={currentUser} currentUser={currentUser} onPostDeleted={handlePostDeleted} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>You haven't posted any photos yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

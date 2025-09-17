'use client';

import { useEffect, useState } from 'react';
import { ProfileHeader } from "@/components/wanderlens/profile-header";
import { getUserById, getPhotosByUserId, getCurrentUser } from "@/lib/mock-data";
import { PhotoCard } from "@/components/wanderlens/photo-card";
import { notFound, useParams } from "next/navigation";
import { User, Photo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const userId = parseInt(id, 10);
    
    const [user, setUser] = useState<User | null>(null);
    const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            try {
                const [userData, photosData, currentUserData] = await Promise.all([
                    getUserById(userId),
                    getPhotosByUserId(userId),
                    getCurrentUser()
                ]);

                if (!userData) {
                    notFound();
                    return;
                }

                setUser(userData);
                setUserPhotos(photosData);
                setCurrentUser(currentUserData);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, userId]);

    if (loading || !user || !currentUser) {
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
                                <PhotoCard photo={photo} user={user} currentUser={currentUser} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>{user.name} hasn't posted any photos yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

type ProfileHeaderProps = {
    user: User;
    photosCount: number;
}

export function ProfileHeader({ user, photosCount }: ProfileHeaderProps) {
    const stats = [
        { label: "Posts", value: photosCount },
        { label: "Followers", value: "1.2k" },
        { label: "Following", value: "345" },
    ]

    return (
        <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
                <h1 className="font-headline text-4xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground text-lg">{user.handle}</p>
                <div className="flex justify-center md:justify-start gap-6 my-4">
                    {stats.map(stat => (
                        <div key={stat.label} className="text-center">
                            <p className="font-bold text-xl">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <p className="max-w-md text-sm">{user.bio}</p>
                 <div className="mt-4 flex justify-center md:justify-start gap-2">
                    <Button>Follow</Button>
                    <Button variant="outline">Message</Button>
                 </div>
            </div>
        </div>
    )
}

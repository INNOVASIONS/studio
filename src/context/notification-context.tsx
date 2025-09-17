
'use client';

import { User } from '@/lib/types';
import React, { createContext, useState, ReactNode } from 'react';
import {
    Heart,
    MessageCircle,
    User as UserIcon,
    FilePlus2
} from 'lucide-react';

type Notification = {
    user: Pick<User, 'name' | 'avatarUrl'>;
    action: string;
    time: string;
    icon: React.ElementType;
    iconClass?: string;
};

type NotificationContextType = {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
};

const defaultNotifications: Notification[] = [
    {
        user: { name: 'Bella Vista', avatarUrl: 'https://picsum.photos/id/238/100/100' },
        action: 'liked your photo.',
        time: '5m ago',
        icon: Heart,
        iconClass: 'text-red-500 fill-red-500'
    },
    {
        user: { name: 'Chris Journeys', avatarUrl: 'https://picsum.photos/id/239/100/100' },
        action: 'commented: "Incredible shot!"',
        time: '12m ago',
        icon: MessageCircle,
        iconClass: 'text-blue-500'
    },
    {
        user: { name: 'Alex Wanderer', avatarUrl: 'https://picsum.photos/id/1025/100/100' },
        action: 'started following you.',
        time: '1h ago',
        icon: UserIcon,
        iconClass: 'text-green-500'
    },
];

export const NotificationContext = createContext<NotificationContextType>({
    notifications: defaultNotifications,
    addNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

    const addNotification = (notification: Notification) => {
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

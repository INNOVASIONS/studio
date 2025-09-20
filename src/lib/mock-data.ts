
'use client';

import type { User, Photo, UserPlace, Comment, Journey } from './types';

// =================================================================================================
// Default Data - This is the fallback data used to initialize localStorage.
// =================================================================================================

const INITIAL_USERS: User[] = [];

const INITIAL_PHOTOS: Photo[] = [];

const INITIAL_JOURNEYS: Journey[] = [];

const INITIAL_PLACES: UserPlace[] = [];

// =================================================================================================
// Data Access Functions - These functions handle reading and writing to localStorage.
// They are designed to be client-side aware.
// =================================================================================================

/**
 * A utility function to safely get data from localStorage.
 * It handles server-side rendering by returning the initial data.
 * On the client-side, it initializes localStorage if it's empty.
 * @param key - The localStorage key.
 * @param initialData - The data to use if localStorage is empty or unavailable.
 * @returns The data from localStorage or the initial data.
 */
function getFromStorage<T>(key: string, initialData: T): T {
  if (typeof window === 'undefined') {
    return initialData;
  }
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return initialData;
  }
}

/**
 * A utility function to safely set data in localStorage.
 * It does nothing if called on the server.
 * @param key - The localStorage key.
 * @param data - The data to store.
 */
function setInStorage<T>(key: string, data: T) {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
        }
    }
}


// Public Data Accessors
export async function getUsers(): Promise<User[]> {
    return getFromStorage('users', INITIAL_USERS);
}

export async function getUserById(id: number): Promise<User | undefined> {
    const users = await getUsers();
    return users.find((user) => user.id === id);
}

export async function getCurrentUser(): Promise<User> {
  if (typeof window === 'undefined') {
    // This is a server-side call. We can't know the current user.
    // Return a default or throw an error. Throwing is better to catch bugs.
    throw new Error("Attempted to call getCurrentUser() from the server but it's a client-only function.");
  }
  try {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const { id } = JSON.parse(storedUser);
      const allUsers = await getUsers();
      const user = allUsers.find(u => u.id === id);
      if (user) return user;
    }
  } catch (error) {
    console.error("Could not access sessionStorage:", error);
  }

  // Fallback if no user is in session. This should ideally not happen in an authenticated context.
  const users = await getUsers();
  if (users.length > 0) {
    return users[0];
  }
  
  throw new Error("No users found and no user in session. Please log in.");
}


export async function updateUser(userId: number, data: Partial<Omit<User, 'id' | 'email'>>): Promise<User> {
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    const updatedUser = { ...users[userIndex], ...data };
    users[userIndex] = updatedUser;

    setInStorage('users', users);
    return updatedUser;
};

export async function getPhotos(): Promise<Photo[]> {
    return getFromStorage('photos', INITIAL_PHOTOS);
}

export async function getPhotosByUserId(userId: number): Promise<Photo[]> {
    const photos = await getPhotos();
    return photos.filter((photo) => photo.userId === userId);
}

export async function getUserPlaces(): Promise<UserPlace[]> {
    return getFromStorage('user_places', INITIAL_PLACES);
}

export async function addPhoto(photoData: Omit<Photo, 'id' | 'likes' | 'comments' | 'timestamp'>): Promise<Photo> {
    const photos = await getPhotos();
    const newPhoto: Photo = {
        id: photos.length > 0 ? Math.max(...photos.map(p => p.id)) + 1 : 1,
        likes: 0,
        comments: [],
        timestamp: 'Just now',
        ...photoData,
    };
    const updatedPhotos = [newPhoto, ...photos];
    setInStorage('photos', updatedPhotos);
    return newPhoto;
};

export async function deletePhoto(photoId: number, userId: number): Promise<void> {
  const photos = await getPhotos();
  const photoIndex = photos.findIndex((p) => p.id === photoId);

  if (photoIndex === -1) {
    throw new Error('Photo not found');
  }

  if (photos[photoIndex].userId !== userId) {
    throw new Error('You are not authorized to delete this post.');
  }

  const updatedPhotos = photos.filter(p => p.id !== photoId);
  setInStorage('photos', updatedPhotos);
};

export async function addUserPlace(place: Omit<UserPlace, 'id'>): Promise<UserPlace> {
    const userPlaces = await getUserPlaces();
    const newPlace = { ...place, id: userPlaces.length + 1 };
    const updatedPlaces = [...userPlaces, newPlace];
    setInStorage('user_places', updatedPlaces);
    return newPlace;
};

export async function getJourneys(): Promise<Journey[]> {
    return getFromStorage('journeys', INITIAL_JOURNEYS);
}

export async function addJourney(journeyData: Omit<Journey, 'id'>): Promise<Journey> {
    const journeys = await getJourneys();
    const newJourney: Journey = {
        id: journeys.length > 0 ? Math.max(...journeys.map(j => j.id)) + 1 : 1,
        ...journeyData,
    };

    const updatedJourneys = [newJourney, ...journeys];
    setInStorage('journeys', updatedJourneys);
    return newJourney;
};

    

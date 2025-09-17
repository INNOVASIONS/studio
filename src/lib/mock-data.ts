
'use client';

import type { User, Photo, UserPlace, Comment, Journey } from './types';

// =================================================================================================
// Default Data - This is the fallback data used to initialize localStorage.
// =================================================================================================

const INITIAL_USERS: User[] = [
    {
      id: 1,
      name: 'Your Name',
      handle: '@yourhandle',
      email: 'yourhandle@example.com',
      avatarUrl: 'https://picsum.photos/id/1005/100/100',
      bio: 'Exploring the world and sharing my journey. All photos are my own!',
    },
    {
      id: 2,
      name: 'Bella Vista',
      handle: '@bellavista',
      email: 'bella@example.com',
      avatarUrl: 'https://picsum.photos/id/238/100/100',
      bio: 'Finding beauty in the details. Urban explorer & nature lover.',
    },
    {
      id: 3,
      name: 'Chris Journeys',
      handle: '@chrisjourneys',
      email: 'chris@example.com',
      avatarUrl: 'https://picsum.photos/id/239/100/100',
      bio: 'Adventures in food, culture, and landscapes. Currently in Southeast Asia.',
    },
];

const INITIAL_PHOTOS: Photo[] = [
  {
    id: 11,
    userId: 2,
    imageUrl: 'https://picsum.photos/id/106/1000/600',
    dataAiHint: 'temple architecture',
    caption: 'Ancient stories carved in stone at the Shore Temple. The sound of the waves nearby is magical.',
    location: 'Mahabalipuram, Tamil Nadu',
    likes: 1987,
    comments: [],
    timestamp: '2h',
    transportName: 'Local Bus 588',
    transportDetails: 'Took a local bus from Chennai, which was very affordable. It\'s a scenic coastal drive.',
    transportRating: 4,
    transportCost: 100,
    restaurantName: 'Fisherman\'s Cove',
    foodDetails: 'Plenty of fresh seafood at the beachside shacks. A simple grilled fish with lemon was perfect.',
    foodRating: 5,
    foodCost: 300,
    currency: 'INR',
  },
  {
    id: 10,
    userId: 3,
    imageUrl: 'https://picsum.photos/id/111/1000/600',
    dataAiHint: 'temple gopuram',
    caption: 'The sheer scale and detail of the Meenakshi Amman Temple gopurams are mind-blowing. Every corner has a story.',
    location: 'Madurai, Tamil Nadu',
    likes: 2450,
    comments: [],
    timestamp: '8h',
    transportName: 'Auto-rickshaw',
    transportDetails: 'Took an auto-rickshaw from the train station. Be sure to agree on the fare beforehand!',
    transportRating: 3,
    transportCost: 150,
    restaurantName: 'Murugan Idli Shop',
    foodDetails: 'Madurai is famous for its street food. Tried "Jigarthanda", a unique local cold drink. Highly recommended to beat the heat!',
    foodRating: 5,
    foodCost: 50,
    currency: 'INR',
  },
  {
    id: 9,
    userId: 1,
    imageUrl: 'https://picsum.photos/id/10/1000/600',
    dataAiHint: 'forest mountains',
    caption: 'Took a trip to the mountains. The air was so fresh!',
    location: 'Rocky Mountains, USA',
    likes: 15,
    comments: [],
    timestamp: '1d',
    transportName: 'Jeep Wrangler 4x4',
    transportDetails: 'Drove up in a 4x4. The roads were a bit rough but the views were worth it.',
    transportRating: 4,
    transportCost: 100,
    restaurantName: 'Mountain Munchies',
    foodDetails: 'Packed our own sandwiches. Nothing beats a simple lunch with a view like this.',
    foodRating: 3,
    foodCost: 20,
    hotelName: 'Starlight Campground',
    hotelDetails: 'We camped at a nearby site. It was basic but had incredible star-gazing opportunities.',
    hotelRating: 5,
    hotelCost: 30,
    currency: 'USD',
  },
  {
    id: 1,
    userId: 2,
    imageUrl: 'https://picsum.photos/id/1015/1000/600',
    dataAiHint: 'mountain lake',
    caption: 'Sunrise over the serene mountain lake. An unforgettable moment.',
    location: 'Alpine Lake, Switzerland',
    likes: 1204,
    comments: [],
    timestamp: '2d',
    transportName: 'SBB Train & PostBus',
    transportDetails: 'Best way to get here is by train to the nearest town, then a local bus. The bus is scenic and much cheaper than a taxi!',
    transportRating: 4,
    transportCost: 25,
    restaurantName: 'Alpine Inn',
    foodDetails: 'Pack a picnic! There are no shops nearby. For dinner, the "Alpine Inn" in the village has amazing fondue at a reasonable price.',
    foodRating: 5,
    foodCost: 40,
    hotelName: 'Guesthouse Alpenrose',
    hotelDetails: 'Stayed at a charming guesthouse in the village. It was cozy and had a great breakfast with mountain views.',
    hotelRating: 4,
    hotelCost: 150,
    currency: 'CHF',
  },
  {
    id: 2,
    userId: 2,
    imageUrl: 'https://picsum.photos/id/1016/1000/600',
    dataAiHint: 'cobblestone street',
    caption: 'Getting lost in the charming cobblestone streets of the old city.',
    location: 'Prague, Czech Republic',
    likes: 2345,
    comments: [],
    timestamp: '3d',
    transportName: 'Prague Trams',
    transportDetails: 'The city center is very walkable. For longer distances, the trams are efficient and affordable. A 24-hour pass is the best value.',
    transportRating: 5,
    transportCost: 5,
    restaurantName: 'Street Vendor',
    foodDetails: 'Trdelník (chimney cake) from a street vendor is a must-try! For a cheap and hearty meal, find a local "jídelna" for traditional Czech food.',
    foodRating: 4,
    foodCost: 15,
    hotelName: 'Cosy Corner Airbnb',
    hotelDetails: 'Found a great Airbnb just outside the main tourist area. It was much cheaper and still very accessible by tram.',
    hotelRating: 4,
    hotelCost: 70,
    currency: 'EUR',
  },
  {
    id: 3,
    userId: 3,
    imageUrl: 'https://picsum.photos/id/1018/1000/600',
    dataAiHint: 'beach sunset',
    caption: 'Golden hour at its finest. The sunsets here are pure magic.',
    location: 'Bali, Indonesia',
    likes: 3102,
    comments: [],
    timestamp: '5d',
    transportName: 'Scooter Rental',
    transportDetails: 'Renting a scooter is the most popular and cheapest way to get around. Alternatively, use ride-sharing apps like Gojek or Grab for the best prices on cars.',
    transportRating: 4,
    transportCost: 150000,
    restaurantName: 'Warung Murah',
    foodDetails: 'Warungs are small, family-owned eateries with delicious and incredibly cheap local food. Try the Nasi Goreng at Warung Murah!',
    foodRating: 5,
    foodCost: 50000,
    hotelName: 'The Sunset Villa',
    hotelDetails: 'Stayed in a beautiful villa with a private pool. It was surprisingly affordable, especially when splitting with friends.',
    hotelRating: 5,
    hotelCost: 800000,
    currency: 'IDR',
  },
  {
    id: 4,
    userId: 1,
    imageUrl: 'https://picsum.photos/id/1019/1000/600',
    dataAiHint: 'city skyline',
    caption: 'The city that never sleeps, viewed from above.',
    location: 'New York City, USA',
    likes: 1890,
    comments: [],
    timestamp: '1w',
    transportName: 'NYC Subway',
    transportDetails: 'The subway is the fastest and most cost-effective way to travel. Buy a MetroCard and load it up. Avoid taxis during rush hour.',
    transportRating: 4,
    transportCost: 3,
    restaurantName: 'Joe\'s Pizza',
    foodDetails: 'You can\'t go wrong with a classic slice of pizza for $1-3 from the thousands of slice shops. Food carts are also great for a cheap and quick bite.',
    foodRating: 3,
    foodCost: 10,
    hotelName: 'Pod 51',
    hotelDetails: 'Stayed at a pod hotel to save money. The rooms are tiny but clean and modern. Great for solo travelers on a budget.',
    hotelRating: 3,
    hotelCost: 120,
    currency: 'USD',
  },
  {
    id: 5,
    userId: 2,
    imageUrl: 'https://picsum.photos/id/1025/1000/600',
    dataAiHint: 'forest path',
    caption: 'A peaceful walk through the ancient redwood forest.',
    location: 'California, USA',
    likes: 2056,
    comments: [],
    timestamp: '2w',
    transportName: 'Rental Car',
    transportDetails: 'A car is essential to explore the vast redwood parks. Rent one from a major airport for the best rates. Book ahead, especially in summer.',
    transportRating: 3,
    restaurantName: 'In-N-Out Burger',
    foodDetails: 'Stock up on groceries in a larger town before heading into the parks. The small general stores have limited options and are pricey. In-N-Out Burger on the way is a classic, affordable Californian meal.',
    foodRating: 4,
    hotelName: 'Jedediah Smith Campground',
    hotelDetails: 'Camping is the best way to experience the parks. The campsites book up months in advance, so plan ahead! Waking up among the giants is unforgettable.',
    hotelRating: 5,
    hotelCost: 45,
    currency: 'USD',
  },
  {
    id: 6,
    userId: 3,
    imageUrl: 'https://picsum.photos/id/103/1000/600',
    dataAiHint: 'desert landscape',
    caption: 'Endless dunes under the vast desert sky.',
    location: 'Merzouga, Morocco',
    likes: 2788,
    comments: [],
    timestamp: '3w',
    transportName: '4x4 Desert Tour',
    transportDetails: 'A 4x4 tour is the only way to go deep into the desert. Book with a reputable company that includes a driver. It\'s not a place for self-driving unless you\'re very experienced.',
    transportRating: 5,
    restaurantName: 'Desert Camp Restaurant',
    foodDetails: 'Meals are usually included with desert tours. Expect lots of tagine! It\'s delicious and authentic. Pack plenty of your own water and snacks for the long drives.',
    foodRating: 4,
    hotelName: 'Berber Desert Camp',
    hotelDetails: 'The desert camp was incredible. We slept in a traditional Berber tent under the stars. More comfortable than you\'d think!',
    hotelRating: 5,
    hotelCost: 600,
    currency: 'MAD',
  },
    {
    id: 7,
    userId: 1,
    imageUrl: 'https://picsum.photos/id/1040/1000/600',
    dataAiHint: 'castle architecture',
    caption: 'Exploring fairytale castles in the German countryside.',
    location: 'Neuschwanstein Castle, Germany',
    likes: 4123,
    comments: [],
    timestamp: '1m',
    transportName: 'Train & Bus 73',
    transportDetails: 'Take the train to Füssen, then bus 73 or 78 towards the castle. The Bayern-Ticket is a great deal for regional train travel for groups.',
    transportRating: 5,
    transportCost: 30,
    restaurantName: 'Gasthof am See',
    foodDetails: 'The restaurants right by the castle are touristy and expensive. Walk down to the village of Hohenschwangau for more traditional and affordable Bavarian food. A bratwurst and pretzel is a classic cheap lunch.',
    foodRating: 3,
    foodCost: 20,
    hotelName: 'Hotel Sonne',
    hotelDetails: 'Stayed in a guesthouse in Füssen. It\'s a charming town and much more affordable than staying right next to the castle.',
    hotelRating: 4,
    hotelCost: 90,
    currency: 'EUR',
    attractionName: 'Neuschwanstein Castle',
    entryFeeCost: 17.50,
  },
  {
    id: 8,
    userId: 2,
    imageUrl: 'https://picsum.photos/id/1043/1000/600',
    dataAiHint: 'street market',
    caption: 'The vibrant colors and smells of a local market.',
    location: 'Marrakech, Morocco',
    likes: 2987,
    comments: [],
    timestamp: '1m',
    transportName: 'Petit Taxi',
    transportDetails: 'The Medina (old city) is a maze best explored on foot. For destinations outside the walls, "petit taxis" are cheap, but make sure they use the meter!',
    transportRating: 3,
    transportCost: 20,
    restaurantName: 'Djemaa el-Fna Food Stalls',
    foodDetails: 'The food stalls in the main square, Djemaa el-Fna, are an amazing experience for dinner. Try various grilled meats and tagines. Be adventurous!',
    foodRating: 5,
    foodCost: 100,
    hotelName: 'Riad Yasmine',
    hotelDetails: 'We stayed in a traditional Riad within the Medina. It was a peaceful oasis hidden away from the bustling streets.',
    hotelRating: 5,
    hotelCost: 700,
    currency: 'MAD',
  },
];

const INITIAL_JOURNEYS: Journey[] = [];

const INITIAL_PLACES: UserPlace[] = [
    {
        id: 1,
        name: 'Murugan Idli Shop',
        type: 'Restaurant',
        description: 'Famous for its soft idlis and variety of chutneys. A must-try for breakfast.',
        lat: 13.0475,
        lng: 80.2587,
        addedBy: 'Bella Vista',
    },
    {
        id: 2,
        name: 'Writer\'s Cafe',
        type: 'Cafe',
        description: 'A quiet cafe with a great book collection. Perfect for working or relaxing.',
        lat: 13.0400,
        lng: 80.2500,
        addedBy: 'Alex Wanderer',
    }
];

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

    

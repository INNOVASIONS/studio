import type { User, Photo, UserPlace } from './types';

const users: User[] = [
  {
    id: 1,
    name: 'Alex Wanderer',
    handle: '@alexwanderer',
    avatarUrl: 'https://picsum.photos/id/237/100/100',
    bio: 'Chasing horizons and camera clicks. Roaming the globe one a a time.',
  },
  {
    id: 2,
    name: 'Bella Vista',
    handle: '@bellavista',
    avatarUrl: 'https://picsum.photos/id/238/100/100',
    bio: 'Finding beauty in the details. Urban explorer & nature lover.',
  },
  {
    id: 3,
    name: 'Chris Journeys',
    handle: '@chrisjourneys',
    avatarUrl: 'https://picsum.photos/id/239/100/100',
    bio: 'Adventures in food, culture, and landscapes. Currently in Southeast Asia.',
  },
];

const photos: Photo[] = [
  {
    id: 1,
    userId: 1,
    imageUrl: 'https://picsum.photos/id/1015/1000/600',
    dataAiHint: 'mountain lake',
    caption: 'Sunrise over the serene mountain lake. An unforgettable moment.',
    location: 'Alpine Lake, Switzerland',
    likes: 1204,
    comments: 88,
    timestamp: '2d',
  },
  {
    id: 2,
    userId: 2,
    imageUrl: 'https://picsum.photos/id/1016/1000/600',
    dataAiHint: 'cobblestone street',
    caption: 'Getting lost in the charming cobblestone streets of the old city.',
    location: 'Prague, Czech Republic',
    likes: 2345,
    comments: 152,
    timestamp: '3d',
  },
  {
    id: 3,
    userId: 3,
    imageUrl: 'https://picsum.photos/id/1018/1000/600',
    dataAiHint: 'beach sunset',
    caption: 'Golden hour at its finest. The sunsets here are pure magic.',
    location: 'Bali, Indonesia',
    likes: 3102,
    comments: 230,
    timestamp: '5d',
  },
  {
    id: 4,
    userId: 1,
    imageUrl: 'https://picsum.photos/id/1019/1000/600',
    dataAiHint: 'city skyline',
    caption: 'The city that never sleeps, viewed from above.',
    location: 'New York City, USA',
    likes: 1890,
    comments: 112,
    timestamp: '1w',
  },
  {
    id: 5,
    userId: 2,
    imageUrl: 'https://picsum.photos/id/1025/1000/600',
    dataAiHint: 'forest path',
    caption: 'A peaceful walk through the ancient redwood forest.',
    location: 'California, USA',
    likes: 2056,
    comments: 178,
    timestamp: '2w',
  },
  {
    id: 6,
    userId: 3,
    imageUrl: 'https://picsum.photos/id/103/1000/600',
    dataAiHint: 'desert landscape',
    caption: 'Endless dunes under the vast desert sky.',
    location: 'Sahara Desert, Morocco',
    likes: 2788,
    comments: 201,
    timestamp: '3w',
  },
    {
    id: 7,
    userId: 1,
    imageUrl: 'https://picsum.photos/id/1040/1000/600',
    dataAiHint: 'castle architecture',
    caption: 'Exploring fairytale castles in the German countryside.',
    location: 'Neuschwanstein Castle, Germany',
    likes: 4123,
    comments: 340,
    timestamp: '1m',
  },
  {
    id: 8,
    userId: 2,
    imageUrl: 'https://picsum.photos/id/1043/1000/600',
    dataAiHint: 'street market',
    caption: 'The vibrant colors and smells of a local market.',
    location: 'Marrakech, Morocco',
    likes: 2987,
    comments: 199,
    timestamp: '1m',
  },
];

let userPlaces: UserPlace[] = [
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

export const getUsers = () => users;
export const getUserById = (id: number) => users.find((user) => user.id === id);
export const getCurrentUser = () => users[0];
export const getPhotos = () => photos;
export const getPhotosByUserId = (userId: number) => photos.filter((photo) => photo.userId === userId);
export const getUserPlaces = () => userPlaces;
export const addUserPlace = (place: Omit<UserPlace, 'id'>) => {
    const newPlace = { ...place, id: userPlaces.length + 1 };
    userPlaces = [...userPlaces, newPlace];
    return newPlace;
};

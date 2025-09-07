
import type { User, Photo, UserPlace } from './types';

const users: User[] = [
  {
    id: 1,
    name: 'Your Name',
    handle: '@yourhandle',
    avatarUrl: 'https://picsum.photos/id/1005/100/100',
    bio: 'Exploring the world and sharing my journey. All photos are my own!',
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

let photos: Photo[] = [
    {
    id: 9,
    userId: 1,
    imageUrl: 'https://picsum.photos/id/10/1000/600',
    dataAiHint: 'forest mountains',
    caption: 'Took a trip to the mountains. The air was so fresh!',
    location: 'Rocky Mountains, USA',
    likes: 15,
    comments: 2,
    timestamp: '1d',
    transportDetails: 'Drove up in a 4x4. The roads were a bit rough but the views were worth it.',
    transportRating: 4,
    transportCost: 100,
    foodDetails: 'Packed our own sandwiches. Nothing beats a simple lunch with a view like this.',
    foodRating: 3,
    foodCost: 20,
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
    comments: 88,
    timestamp: '2d',
    transportDetails: 'Best way to get here is by train to the nearest town, then a local bus. The bus is scenic and much cheaper than a taxi!',
    transportRating: 4,
    transportCost: 25,
    foodDetails: 'Pack a picnic! There are no shops nearby. For dinner, the "Alpine Inn" in the village has amazing fondue at a reasonable price.',
    foodRating: 5,
    foodCost: 40,
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
    comments: 152,
    timestamp: '3d',
    transportDetails: 'The city center is very walkable. For longer distances, the trams are efficient and affordable. A 24-hour pass is the best value.',
    transportRating: 5,
    transportCost: 5,
    foodDetails: 'Trdelník (chimney cake) from a street vendor is a must-try! For a cheap and hearty meal, find a local "jídelna" for traditional Czech food.',
    foodRating: 4,
    foodCost: 15,
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
    comments: 230,
    timestamp: '5d',
    transportDetails: 'Renting a scooter is the most popular and cheapest way to get around. Alternatively, use ride-sharing apps like Gojek or Grab for the best prices on cars.',
    transportRating: 4,
    transportCost: 150000,
    foodDetails: 'Warungs are small, family-owned eateries with delicious and incredibly cheap local food. Try the Nasi Goreng at Warung Murah!',
    foodRating: 5,
    foodCost: 50000,
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
    comments: 112,
    timestamp: '1w',
    transportDetails: 'The subway is the fastest and most cost-effective way to travel. Buy a MetroCard and load it up. Avoid taxis during rush hour.',
    transportRating: 4,
    transportCost: 3,
    foodDetails: 'You can\'t go wrong with a classic slice of pizza for $1-3 from the thousands of slice shops. Food carts are also great for a cheap and quick bite.',
    foodRating: 3,
    foodCost: 10,
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
    comments: 178,
    timestamp: '2w',
    transportDetails: 'A car is essential to explore the vast redwood parks. Rent one from a major airport for the best rates. Book ahead, especially in summer.',
    foodDetails: 'Stock up on groceries in a larger town before heading into the parks. The small general stores have limited options and are pricey. In-N-Out Burger on the way is a classic, affordable Californian meal.',
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
    comments: 201,
    timestamp: '3w',
    transportDetails: 'A 4x4 tour is the only way to go deep into the desert. Book with a reputable company that includes a driver. It\'s not a place for self-driving unless you\'re very experienced.',
    foodDetails: 'Meals are usually included with desert tours. Expect lots of tagine! It\'s delicious and authentic. Pack plenty of your own water and snacks for the long drives.',
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
    comments: 340,
    timestamp: '1m',
    transportDetails: 'Take the train to Füssen, then bus 73 or 78 towards the castle. The Bayern-Ticket is a great deal for regional train travel for groups.',
    transportRating: 5,
    transportCost: 30,
    foodDetails: 'The restaurants right by the castle are touristy and expensive. Walk down to the village of Hohenschwangau for more traditional and affordable Bavarian food. A bratwurst and pretzel is a classic cheap lunch.',
    foodRating: 3,
    foodCost: 20,
    currency: 'EUR',
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
    transportDetails: 'The Medina (old city) is a maze best explored on foot. For destinations outside the walls, "petit taxis" are cheap, but make sure they use the meter!',
    transportRating: 3,
    transportCost: 20,
    foodDetails: 'The food stalls in the main square, Djemaa el-Fna, are an amazing experience for dinner. Try various grilled meats and tagines. Be adventurous!',
    foodRating: 5,
    foodCost: 100,
    currency: 'MAD',
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

export const addPhoto = (photoData: Omit<Photo, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
    const newPhoto: Photo = {
        id: photos.length > 0 ? Math.max(...photos.map(p => p.id)) + 1 : 1,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        ...photoData,
    };
    photos = [newPhoto, ...photos];
    return newPhoto;
};

export const addUserPlace = (place: Omit<UserPlace, 'id'>) => {
    const newPlace = { ...place, id: userPlaces.length + 1 };
    userPlaces = [...userPlaces, newPlace];
    return newPlace;
};

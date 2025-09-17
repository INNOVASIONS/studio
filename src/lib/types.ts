
export type User = {
  id: number;
  name: string;
  handle: string;
  avatarUrl: string;
  bio: string;
  email: string;
};

export type Comment = {
  id: number;
  user: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  text: string;
  timestamp: string;
};

export type Photo = {
  id: number;
  userId: number;
  imageUrl: string;
  caption: string;
  location: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  dataAiHint?: string;
  transportDetails?: string;
  foodDetails?: string;
  hotelDetails?: string;
  transportRating?: number;
  foodRating?: number;
  hotelRating?: number;
  transportCost?: number;
  foodCost?: number;
  hotelCost?: number;
  currency?: string;
  restaurantName?: string;
  hotelName?: string;
  transportName?: string;
  attractionName?: string;
  entryFeeCost?: number;
};

export type UserPlace = {
  id: number;
  name: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
  addedBy: string;
};

export type VisitedPlace = {
  name: string;
  photos: string[]; // Store as data URIs or URLs
  description: string;
};

export type DailyActivity = {
  day: number;
  date: string; // Store date as ISO string
  places: VisitedPlace[];
};


export type Journey = {
  id: number;
  userId: number;
  placeVisited: string;
  startDate?: Date;
  endDate?: Date;
  travelers: number;
  transportMode?: string;
  transportCost?: number;
  transportCurrency?: string;
  transportDetails?: string;
  hotelName?: string;
  hotelPhotos: string[]; // Store as data URIs or URLs
  hotelDuration?: number;
  hotelCost?: number;
  hotelCurrency?: string;
  hotelReview?: string;
  dailyActivities: DailyActivity[];
};

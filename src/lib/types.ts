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
  transportRating?: number;
  foodRating?: number;
  transportCost?: number;
  foodCost?: number;
  currency?: string;
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

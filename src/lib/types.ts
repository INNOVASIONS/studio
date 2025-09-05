export type User = {
  id: number;
  name: string;
  handle: string;
  avatarUrl: string;
  bio: string;
};

export type Photo = {
  id: number;
  userId: number;
  imageUrl: string;
  caption: string;
  location: string;
  likes: number;
  comments: number;
  timestamp: string;
  dataAiHint?: string;
};

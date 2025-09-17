
'use server';

import {
  generateTravelItinerary,
  GenerateTravelItineraryInput,
} from '@/ai/flows/generate-travel-itinerary';
import {
  imageBasedLocationFinder,
  ImageBasedLocationFinderInput,
} from '@/ai/flows/image-based-location-finder';
import { translatePost, TranslatePostInput } from '@/ai/flows/translate-text';
import { revalidatePath } from 'next/cache';
import { addJourney, addPhoto, deletePhoto, updateUser } from './mock-data';
import { DailyActivity, VisitedPlace, Photo, User } from './types';

export type ItineraryState = {
  itinerary?: string;
  error?: string;
};

export async function handleGenerateItinerary(
  prevState: ItineraryState,
  formData: FormData
): Promise<ItineraryState> {
  const destination = formData.get('destination') as string;
  const preferences = formData.get('preferences') as string;

  if (!destination || !preferences) {
    return { error: 'Please provide both a destination and your preferences.' };
  }

  try {
    const input: GenerateTravelItineraryInput = { destination, preferences };
    const result = await generateTravelItinerary(input);
    return { itinerary: result.itinerary };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to generate itinerary.' };
  }
}

export type LocationState = {
  locationName?: string;
  confidence?: number;
  error?: string;
};

export async function handleFindLocation(
  prevState: LocationState,
  formData: FormData
): Promise<LocationState> {
  const photoDataUri = formData.get('photoDataUri') as string;

  if (!photoDataUri) {
    return { error: 'Please upload an image file.' };
  }

  try {
    const input: ImageBasedLocationFinderInput = { photoDataUri };
    const result = await imageBasedLocationFinder(input);
    return {
      locationName: result.locationName,
      confidence: result.confidence,
    };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to identify location from image.' };
  }
}

export type TranslationState = {
    translatedCaption?: string;
    translatedTransportDetails?: string;
    translatedFoodDetails?: string;
    translatedHotelDetails?: string;
    error?: string;
};


export async function handleTranslatePost(
  input: TranslatePostInput
): Promise<TranslationState> {
  const { caption, targetLanguage } = input;

  if (!caption || !targetLanguage) {
    return { error: 'Caption and target language are required.' };
  }

  try {
    const result = await translatePost(input);
    return {
      translatedCaption: result.translatedCaption,
      translatedTransportDetails: result.translatedTransportDetails,
      translatedFoodDetails: result.translatedFoodDetails,
      translatedHotelDetails: result.translatedHotelDetails,
    };
  } catch (e: any)
{
    console.error('Translation action failed:', e);
    // Provide a more user-friendly error message
    if (e.message.includes('FETCH_ERROR') || e.message.includes('permission') || e.message.includes('CORS')) {
      return { error: 'There was a network issue preventing translation. Please try again later.' };
    }
    return { error: e.message || 'An unexpected error occurred during translation.' };
  }
}

export type CreateJourneyState = {
  message?: string;
  success?: boolean;
  error?: string;
};


// Helper function to read file as Data URL
async function readFileAsDataURL(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}


export async function handleCreateJourney(
  prevState: CreateJourneyState,
  formData: FormData
): Promise<CreateJourneyState> {
  const userId = parseInt(formData.get('userId') as string, 10);
  if (isNaN(userId)) {
    return { error: 'User is not authenticated.' };
  }

  try {
    const dailyActivitiesData = JSON.parse(formData.get('daily-activities-data') as string);

    const dailyActivitiesPromises = dailyActivitiesData.map(async (day: any, dayIndex: number) => {
        const placesPromises = day.places.map(async (place: any, placeIndex: number) => {
            const photoInputName = `day-${dayIndex}-place-${placeIndex}-photos`;
            const photos: File[] = formData.getAll(photoInputName) as File[];

            const photoUrls = await Promise.all(
                photos.filter(photo => photo.size > 0).map(photo => readFileAsDataURL(photo))
            );
            return {
                name: place.name,
                description: place.description,
                photos: photoUrls
            };
        });
        const resolvedPlaces: VisitedPlace[] = await Promise.all(placesPromises);

        return {
            day: day.day,
            date: day.date,
            places: resolvedPlaces,
        };
    });

    const dailyActivities: DailyActivity[] = await Promise.all(dailyActivitiesPromises);

    const hotelPhotosFiles: File[] = formData.getAll('hotel-photos') as File[];
    const hotelPhotoUrls = await Promise.all(
        hotelPhotosFiles.filter(photo => photo.size > 0).map(photo => readFileAsDataURL(photo))
    );

    const journeyData = {
      userId: userId,
      placeVisited: formData.get('place-visited') as string,
      startDate: formData.get('start-date') as string,
      endDate: formData.get('end-date') as string,
      travelers: parseInt(formData.get('travelers') as string, 10),
      transportMode: formData.get('transport-mode') as string | undefined,
      transportCost: parseFloat(formData.get('transport-cost') as string) || undefined,
      transportCurrency: formData.get('transport-currency') as string | undefined,
      transportDetails: formData.get('transport-details') as string | undefined,
      hotelName: formData.get('hotel-name') as string | undefined,
      hotelPhotos: hotelPhotoUrls,
      hotelDuration: parseInt(formData.get('hotel-duration') as string, 10) || undefined,
      hotelCost: parseFloat(formData.get('hotel-cost') as string) || undefined,
      hotelCurrency: formData.get('hotel-currency') as string | undefined,
      hotelReview: formData.get('hotel-review') as string | undefined,
      dailyActivities: dailyActivities.map(day => ({
        ...day,
        places: day.places.filter(p => p.name.trim() !== '')
      })),
    };

    await addJourney(journeyData);

  } catch (error: any) {
    console.error('Failed to create journey:', error);
    return { error: 'Failed to process journey data. ' + error.message };
  }

  revalidatePath('/create-journey');
  return { success: true, message: "Journey created!"}
}

export type DeletePostState = {
  error?: string;
  success?: boolean;
};

export async function handleDeletePost(
  photoId: number,
  userId: number
): Promise<DeletePostState> {
  if (typeof photoId !== 'number') {
    return { error: 'Invalid Photo ID.' };
  }

  try {
    await deletePhoto(photoId, userId);
  } catch (error: any) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  revalidatePath('/');
  revalidatePath('/discover');
  return { success: true };
}

export type UpdateProfileState = {
  error?: string;
  success?: boolean;
};

export async function handleUpdateProfile(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const name = formData.get('name') as string;
  const handle = formData.get('handle') as string;
  const bio = formData.get('bio') as string;
  const avatarDataUri = formData.get('avatarDataUri') as string | undefined;
  const userId = parseInt(formData.get('userId') as string, 10);
  
  if (isNaN(userId)) {
    return { error: 'User is not authenticated.' };
  }

  if (!name || !handle) {
    return { error: 'Name and handle are required.' };
  }

  try {
    const userData: { name: string; handle: string; bio: string; avatarUrl?: string } = { name, handle, bio };
    if (avatarDataUri) {
      userData.avatarUrl = avatarDataUri;
    }
    await updateUser(userId, userData);
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }

  revalidatePath(`/profile/${userId}`);
  revalidatePath('/profile');
  // Revalidate layout to update header avatar
  revalidatePath('/', 'layout');
  return { success: true };
}


export async function handleCreatePost(
  formData: FormData,
  userId: number
): Promise<{ newPost?: Photo; error?: string }> {
  const caption = formData.get('caption') as string;
  const location = formData.get('location') as string;
  const photoDataUri = formData.get('photoDataUri') as string;

  if (!photoDataUri || !caption || !location) {
    return { error: 'Photo, caption, and location are required.' };
  }

  try {
    const newPostData: Omit<Photo, 'id' | 'likes' | 'comments' | 'timestamp'> = {
      userId: userId,
      imageUrl: photoDataUri,
      caption,
      location,
      currency: (formData.get('currency') as string) || undefined,
      transportDetails:
        (formData.get('transportDetails') as string) || undefined,
      foodDetails: (formData.get('foodDetails') as string) || undefined,
      hotelDetails: (formData.get('hotelDetails') as string) || undefined,
      restaurantName:
        (formData.get('restaurantName') as string) || undefined,
      hotelName: (formData.get('hotelName') as string) || undefined,
      transportName: (formData.get('transportName') as string) || undefined,
      transportRating:
        Number(formData.get('transportRating')) || undefined,
      foodRating: Number(formData.get('foodRating')) || undefined,
      hotelRating: Number(formData.get('hotelRating')) || undefined,
      transportCost:
        parseFloat(formData.get('transportCost') as string) || undefined,
      foodCost: parseFloat(formData.get('foodCost') as string) || undefined,
      hotelCost: parseFloat(formData.get('hotelCost') as string) || undefined,
      attractionName:
        (formData.get('attractionName') as string) || undefined,
      entryFeeCost:
        parseFloat(formData.get('entryFeeCost') as string) || undefined,
    };
    
    const newPost = await addPhoto(newPostData);
    revalidatePath('/');
    revalidatePath('/discover');
    revalidatePath('/profile');
    
    return { newPost };
  } catch (err: any) {
    return { error: err.message || 'Failed to create post. Please try again.' };
  }
}

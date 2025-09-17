
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
import { addJourney, deletePhoto, updateUser, getCurrentUser } from './mock-data';
import { DailyActivity, VisitedPlace } from './types';

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
  const { caption, targetLanguage, photoUrl } = input;

  if (!caption || !targetLanguage || !photoUrl) {
    return { error: 'Caption, target language, and photo are required.' };
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
      return { error: 'Could not retrieve the image for translation context due to a network or permission issue. Please try again later.' };
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
  const currentUser = await getCurrentUser();

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
      userId: currentUser.id,
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
  photoId: number
): Promise<DeletePostState> {
  if (typeof photoId !== 'number') {
    return { error: 'Invalid Photo ID.' };
  }

  try {
    await deletePhoto(photoId);
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
  const currentUser = await getCurrentUser();

  if (!name || !handle) {
    return { error: 'Name and handle are required.' };
  }

  try {
    const userData: { name: string; handle: string; bio: string; avatarUrl?: string } = { name, handle, bio };
    if (avatarDataUri) {
      userData.avatarUrl = avatarDataUri;
    }
    await updateUser(currentUser.id, userData);
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }

  revalidatePath(`/profile/${currentUser.id}`);
  revalidatePath('/profile');
  // Revalidate layout to update header avatar
  revalidatePath('/', 'layout');
  return { success: true };
}

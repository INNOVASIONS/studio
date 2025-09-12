
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
import { addPhoto, getCurrentUser, addJourney, deletePhoto } from './mock-data';
import { VisitedPlace } from './types';

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

export type CreatePostState = {
  message: string;
  success?: boolean;
};

export async function handleCreatePost(
  prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const currentUser = getCurrentUser();
  const photoDataUri = formData.get('photoDataUri') as string;
  const caption = formData.get('caption') as string;
  const location = formData.get('location') as string;
  const currency = formData.get('currency') as string | undefined;
  const transportDetails = formData.get('transportDetails') as string | undefined;
  const foodDetails = formData.get('foodDetails') as string | undefined;
  const hotelDetails = formData.get('hotelDetails') as string | undefined;
  const restaurantName = formData.get('restaurantName') as string | undefined;
  const hotelName = formData.get('hotelName') as string | undefined;
  const transportName = formData.get('transportName') as string | undefined;
  const transportRating = parseInt(formData.get('transportRating') as string, 10) || undefined;
  const foodRating = parseInt(formData.get('foodRating') as string, 10) || undefined;
  const hotelRating = parseInt(formData.get('hotelRating') as string, 10) || undefined;
  const transportCost = parseFloat(formData.get('transportCost') as string) || undefined;
  const foodCost = parseFloat(formData.get('foodCost') as string) || undefined;
  const hotelCost = parseFloat(formData.get('hotelCost') as string) || undefined;
  const attractionName = formData.get('attractionName') as string | undefined;
  const entryFeeCost = parseFloat(formData.get('entryFeeCost') as string) || undefined;
  
  if (!photoDataUri || !caption || !location) {
    return { message: 'Photo, caption, and location are required.' };
  }

  try {
    addPhoto({
      userId: currentUser.id,
      imageUrl: photoDataUri, // Using data URI directly as mock data
      caption,
      location,
      currency,
      transportDetails,
      foodDetails,
      hotelDetails,
      restaurantName,
      hotelName,
      transportName,
      transportRating,
      foodRating,
      hotelRating,
      transportCost,
      foodCost,
      hotelCost,
      attractionName,
      entryFeeCost,
    });
  } catch (error) {
    console.error(error);
    return { message: 'Failed to create post.' };
  }

  revalidatePath('/');
  revalidatePath('/profile');
  return { message: 'Post created successfully', success: true };
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
  const currentUser = getCurrentUser();

  try {
    const visitedPlacesData = JSON.parse(formData.get('visited-places-data') as string);

    const visitedPlacesPromises = visitedPlacesData.map(async (p: any, index: number) => {
        const photos: File[] = formData.getAll(`place-photos-${index}`) as File[];
        const photoUrls = await Promise.all(
            photos.filter(photo => photo.size > 0).map(photo => readFileAsDataURL(photo))
        );
        return {
            name: p.name,
            description: p.description,
            photos: photoUrls
        };
    });
    
    const visitedPlaces: VisitedPlace[] = await Promise.all(visitedPlacesPromises);

    const hotelPhotosFiles: File[] = formData.getAll('hotel-photos') as File[];
    const hotelPhotoUrls = await Promise.all(
        hotelPhotosFiles.filter(photo => photo.size > 0).map(photo => readFileAsDataURL(photo))
    );

    const journeyData = {
      userId: currentUser.id,
      placeVisited: formData.get('place-visited') as string,
      startDate: new Date(formData.get('start-date') as string),
      endDate: new Date(formData.get('end-date') as string),
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
      visitedPlaces: visitedPlaces,
    };

    addJourney(journeyData);

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
    deletePhoto(photoId);
  } catch (error: any) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  revalidatePath('/');
  revalidatePath('/discover');
  return { success: true };
}

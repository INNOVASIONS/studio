
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
import { redirect } from 'next/navigation';
import { addPhoto, getCurrentUser } from './mock-data';

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
  const transportRating = parseInt(formData.get('transportRating') as string, 10) || undefined;
  const foodRating = parseInt(formData.get('foodRating') as string, 10) || undefined;
  const transportCost = parseFloat(formData.get('transportCost') as string) || undefined;
  const foodCost = parseFloat(formData.get('foodCost') as string) || undefined;
  
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
      transportRating,
      foodRating,
      transportCost,
      foodCost,
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
    error?: string;
};

export async function handleTranslatePost(
    prevState: TranslationState,
    formData: FormData
): Promise<TranslationState> {
    const caption = formData.get('caption') as string;
    const transportDetails = formData.get('transportDetails') as string;
    const foodDetails = formData.get('foodDetails') as string;
    const targetLanguage = formData.get('targetLanguage') as string;

    if (!caption || !targetLanguage) {
        return { error: 'Caption and target language are required.' };
    }

    try {
        const input: TranslatePostInput = { 
            caption, 
            targetLanguage,
        };
        if (transportDetails) input.transportDetails = transportDetails;
        if (foodDetails) input.foodDetails = foodDetails;

        const result = await translatePost(input);
        return { 
            translatedCaption: result.translatedCaption,
            translatedTransportDetails: result.translatedTransportDetails,
            translatedFoodDetails: result.translatedFoodDetails,
        };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'Failed to translate text.' };
    }
}

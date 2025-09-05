'use server';
/**
 * @fileOverview An AI agent that finds the geographical location of a photo.
 *
 * - imageBasedLocationFinder - A function that handles the location finding process.
 * - ImageBasedLocationFinderInput - The input type for the imageBasedLocationFinder function.
 * - ImageBasedLocationFinderOutput - The return type for the imageBasedLocationFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageBasedLocationFinderInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageBasedLocationFinderInput = z.infer<typeof ImageBasedLocationFinderInputSchema>;

const ImageBasedLocationFinderOutputSchema = z.object({
  locationName: z
    .string()
    .describe(
      'The exact geographical location name, such as "Eiffel Tower, Paris" or "Grand Canyon National Park, USA". If the location cannot be determined, this should be "Unknown Location".'
    ),
  confidence: z
    .number()
    .describe(
      'The confidence level of the location identification, from 0 to 1. If the location is unknown, this should be 0.'
    ),
});
export type ImageBasedLocationFinderOutput = z.infer<typeof ImageBasedLocationFinderOutputSchema>;

export async function imageBasedLocationFinder(
  input: ImageBasedLocationFinderInput
): Promise<ImageBasedLocationFinderOutput> {
  return imageBasedLocationFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageBasedLocationFinderPrompt',
  input: {schema: ImageBasedLocationFinderInputSchema},
  output: {schema: ImageBasedLocationFinderOutputSchema},
  prompt: `You are a geographical location identifier. Your task is to analyze the provided photo and determine its location. Provide the specific name of the place, landmark, city, and country (e.g., "Eiffel Tower, Paris, France" or "Machu Picchu, Peru"). You must also provide a confidence score between 0 and 1.

If you cannot determine the location, you must return "Unknown Location" for the locationName and a confidence of 0.

You must respond in a valid JSON format that strictly adheres to the provided output schema.

Photo: {{media url=photoDataUri}}`,
});

const imageBasedLocationFinderFlow = ai.defineFlow(
  {
    name: 'imageBasedLocationFinderFlow',
    inputSchema: ImageBasedLocationFinderInputSchema,
    outputSchema: ImageBasedLocationFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Unable to determine location from the provided image. The AI model did not return a valid response.');
    }
    return output;
  }
);

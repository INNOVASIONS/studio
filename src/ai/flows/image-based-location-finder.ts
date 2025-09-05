'use server';
/**
 * @fileOverview An AI agent that finds the geographical coordinates of a photo.
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
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
  confidence: z
    .number()
    .describe(
      'The confidence level of the location identification, from 0 to 1.'
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
  prompt: `You are a geographical location identifier. Given a photo, you will identify the latitude and longitude of where the photo was taken.

  Respond in a JSON format.

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
    return output!;
  }
);

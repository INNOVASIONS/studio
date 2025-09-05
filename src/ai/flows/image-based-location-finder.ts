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
  prompt: `You are a master geographical location identifier. Your task is to analyze the provided photo and determine the precise latitude and longitude where it was taken. You must also provide a confidence score between 0 and 1.

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
      throw new Error('Unable to determine location from the provided image.');
    }
    return output;
  }
);

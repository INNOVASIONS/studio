
'use server';

/**
 * @fileOverview A text translation AI agent.
 *
 * - translatePost - A function that handles the text translation process for a post.
 * - TranslatePostInput - The input type for the translatePost function.
 * - TranslatePostOutput - The return type for the translatePost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslatePostInputSchema = z.object({
  targetLanguage: z
    .string()
    .describe(
      'The target language to translate the text into (e.g., "English", "Spanish", "Japanese").'
    ),
  caption: z.string().describe('The post caption to be translated.'),
  transportDetails: z
    .string()
    .optional()
    .describe('The transport details to be translated.'),
  foodDetails: z
    .string()
    .optional()
    .describe('The food details to be translated.'),
});
export type TranslatePostInput = z.infer<typeof TranslatePostInputSchema>;

const TranslatePostOutputSchema = z.object({
  translatedCaption: z.string().describe('The translated post caption.'),
  translatedTransportDetails: z
    .string()
    .optional()
    .describe('The translated transport details.'),
  translatedFoodDetails: z
    .string()
    .optional()
    .describe('The translated food details.'),
});
export type TranslatePostOutput = z.infer<typeof TranslatePostOutputSchema>;

export async function translatePost(
  input: TranslatePostInput
): Promise<TranslatePostOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslatePostInputSchema},
  output: {schema: TranslatePostOutputSchema},
  prompt: `Translate the following JSON object's text values into {{targetLanguage}}.
Return a JSON object with the translated text. The keys for the translated fields must be "translatedCaption", "translatedTransportDetails", and "translatedFoodDetails".
If a field is not provided in the input, do not include it in the output.

Input:
{
  "caption": "{{{caption}}}",
  {{#if transportDetails}}
  "transportDetails": "{{{transportDetails}}}",
  {{/if}}
  {{#if foodDetails}}
  "foodDetails": "{{{foodDetails}}}"
  {{/if}}
}

Respond with only the translated JSON object.`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslatePostInputSchema,
    outputSchema: TranslatePostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid response.');
    }
    return output;
  }
);

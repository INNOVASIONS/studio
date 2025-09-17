
'use server';

/**
 * @fileOverview A text translation AI agent.
 *
 * - translatePost - A function that handles the text translation process for a post.
 * - TranslatePostInput - The input type for the translatePost function.
 * - TranslatePostOutput - The return type for the translate-post function.
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
  hotelDetails: z
    .string()
    .optional()
    .describe('The hotel details to be translated.'),
  restaurantName: z
    .string()
    .optional()
    .describe('The name of the restaurant, if any.'),
  hotelName: z
    .string()
    .optional()
    .describe('The name of the hotel, if any.'),
  transportName: z
    .string()
    .optional()
    .describe('The name or number of the transport, if any (e.g., "Bus 7H").'),
  rating: z
    .number()
    .optional()
    .describe('An aggregate rating for the post (e.g., average of food and transport).'),
  transportCost: z.number().optional().describe('The cost of transport.'),
  foodCost: z.number().optional().describe('The cost of food.'),
  hotelCost: z.number().optional().describe('The cost of the hotel.'),
  currency: z.string().optional().describe('The currency for the costs (e.g., USD, EUR).'),
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
  translatedHotelDetails: z
    .string()
    .optional()
    .describe('The translated hotel details.'),
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
  prompt: `You are a helpful translation assistant for a travel social media app. Your task is to translate the user's post content into {{targetLanguage}}.

Use the provided context to make the translation more natural and accurate. The context includes user ratings and costs. If costs are mentioned, ensure they are formatted correctly and are understandable in the target language and culture.

**Context:**
- **Overall Rating:** {{rating}}/5
- **Currency for costs:** {{currency}}

**Text to Translate:**

- **Caption:** "{{{caption}}}"
{{#if transportDetails}}
- **Transport Details:** "{{{transportDetails}}}"
  {{#if transportName}}- **Transport Name/Number:** "{{{transportName}}}"{{/if}}
  - **Transport Cost:** {{transportCost}}
{{/if}}
{{#if foodDetails}}
- **Food Details:** "{{{foodDetails}}}"
  {{#if restaurantName}}- **Restaurant Name:** "{{{restaurantName}}}"{{/if}}
  - **Food Cost:** {{foodCost}}
{{/if}}
{{#if hotelDetails}}
- **Hotel Details:** "{{{hotelDetails}}}"
  {{#if hotelName}}- **Hotel Name:** "{{{hotelName}}}"{{/if}}
  - **Hotel Cost:** {{hotelCost}}
{{/if}}


Please provide a JSON object with the translated text. The keys must be "translatedCaption", "translatedTransportDetails", "translatedFoodDetails", and "translatedHotelDetails".
Translate the text naturally, as a native speaker would write it for a social media post. Do not translate the keys of the JSON object.
If a text field (like transportDetails) is not provided in the input, do not include its corresponding key in the output.

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

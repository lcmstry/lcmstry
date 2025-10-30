'use server';
/**
 * @fileOverview A flow to moderate user-generated text for inappropriate content.
 *
 * - moderateText - A function that checks if a given text contains harmful content.
 * - ModerateTextInput - The input type for the moderateText function.
 * - ModerateTextOutput - The return type for the moderateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateTextInputSchema = z.object({
  text: z.string().describe('The text content to be moderated.'),
});
export type ModerateTextInput = z.infer<typeof ModerateTextInputSchema>;

const ModerateTextOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe(
      'Whether the text is appropriate (true) or contains prohibited content (false).'
    ),
});
export type ModerateTextOutput = z.infer<typeof ModerateTextOutputSchema>;

export async function moderateText(
  input: ModerateTextInput
): Promise<ModerateTextOutput> {
  return moderateTextFlow(input);
}

const moderationPrompt = ai.definePrompt({
  name: 'moderationPrompt',
  input: {schema: ModerateTextInputSchema},
  output: {schema: ModerateTextOutputSchema},
  prompt: `You are a content moderator for an anonymous messaging app. Your task is to determine if a message is appropriate or not.

You must flag content as inappropriate if it contains any of the following:
- Hate speech, harassment, or threats.
- Profanity, sexually explicit language, or descriptions of vulgar acts (including references to genitalia, insults like "bodoh", "tolol", "goblok", etc.).
- Spam or advertisements.
- Personally identifiable information.

Analyze the following text and determine if it is appropriate.

Text to analyze:
"{{text}}"

Based on your analysis, set the 'isAppropriate' field. It should be 'false' if the content violates the rules, and 'true' otherwise.`,
});

const moderateTextFlow = ai.defineFlow(
  {
    name: 'moderateTextFlow',
    inputSchema: ModerateTextInputSchema,
    outputSchema: ModerateTextOutputSchema,
  },
  async input => {
    const {output} = await moderationPrompt(input);
    return output!;
  }
);

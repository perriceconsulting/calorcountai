import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../config/openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Fetches a recipe for a given food description using OpenAI.
 */
export async function fetchRecipeFor(description: string): Promise<string> {
  const prompt = `Provide a simple recipe for: ${description}. Include ingredients list and numbered cooking steps.`;
  const response = await openai.chat.completions.create({
    model: OPENAI_CONFIG.model,
    messages: [
      { role: 'system', content: 'You are a helpful recipe assistant.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 500,
    temperature: 0.7
  });
  return response.choices[0]?.message?.content || 'No recipe available.';
}

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
/**
 * Extracts ingredients list from a full recipe using OpenAI.
 */
export async function fetchShoppingList(recipe: string): Promise<string[]> {
  const prompt = `Extract only the ingredients from the following recipe as a JSON array of strings. Do not include steps or descriptions.\n\nRecipe:\n${recipe}`;
  const response = await openai.chat.completions.create({
    model: OPENAI_CONFIG.model,
    messages: [
      { role: 'system', content: 'You extract ingredients lists from recipes.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 300,
    temperature: 0
  });
  const content = response.choices[0]?.message?.content || '[]';
  try {
    // attempt to parse JSON array
    const arr = JSON.parse(content);
    if (Array.isArray(arr)) return arr;
  } catch {}
  // fallback: take the first section (ingredients) before the first blank line
  // fallback: extract lines under 'Ingredients:' heading (bulleted or numbered)
  const ingredientsMatch = recipe.match(/Ingredients[:]?\s*[\r\n]+([\s\S]*?)(?=\n\s*\n|$|Steps[:]?)/i);
  const ingredientSection = ingredientsMatch ? ingredientsMatch[1] : recipe;
  return ingredientSection
    .split(/\r?\n/)
    .filter(line => /^\s*(?:[-*•]\s+|\d+)/.test(line))
    .map(line => line.replace(/^\s*(?:[-*•]\s*|\d+\.?\s*)/, '').trim());
}

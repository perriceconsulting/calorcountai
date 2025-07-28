import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../config/openai';
import { cleanJsonResponse, safeJsonParse } from '../utils/jsonParser';
import { convertDataURLToBase64 } from '../utils/canvasUtils';
import type { FoodAnalysis } from '../types/food';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeFoodImage(dataURL: string): Promise<FoodAnalysis | null> {
  try {
    // Ensure DataURL format
    if (!dataURL.startsWith('data:image/')) {
      throw new Error('analyzeFoodImage expects a DataURL string');
    }

    // Convert DataURL to base64
    const base64Image = convertDataURLToBase64(dataURL);
    if (!base64Image) {
      throw new Error('Failed to convert DataURL to base64');
    }

    // Validate API key
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing');
    }

    console.debug('Sending image analysis to OpenAI, snippet:', base64Image.slice(0, 50) + '...');
    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: OPENAI_CONFIG.promptTemplate },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ],
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: 0,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const cleaned = cleanJsonResponse(content);
    const parsed = safeJsonParse<FoodAnalysis>(cleaned);
    if (!parsed) {
      throw new Error('Failed to parse OpenAI response');
    }

    // Validate response structure
    const { description, macros } = parsed;
    if (!description || !macros ||
        typeof macros.calories !== 'number' ||
        typeof macros.protein !== 'number' ||
        typeof macros.fat !== 'number' ||
        typeof macros.carbs !== 'number') {
      throw new Error('Invalid response structure from OpenAI');
    }

    return parsed;
  } catch (error) {
    console.error('analyzeFoodImage error:', error);
    return null;
  }
}
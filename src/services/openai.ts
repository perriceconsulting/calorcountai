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
    if (!dataURL.startsWith('data:image/')) {
      throw new Error('Invalid image format');
    }

    // Convert data URL to base64
    const base64Image = convertDataURLToBase64(dataURL);
    if (!base64Image) {
      throw new Error('Failed to convert image to base64');
    }

    // Validate API key
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing');
    }

    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: OPENAI_CONFIG.promptTemplate 
            },
            { 
              type: "image_url", 
              image_url: { 
                url: `data:image/jpeg;base64,${base64Image}`
              } 
            }
          ]
        }
      ],
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }
    
    const cleanedContent = cleanJsonResponse(content);
    const parsed = safeJsonParse<FoodAnalysis>(cleanedContent);
    
    if (!parsed) {
      throw new Error('Failed to parse OpenAI response');
    }

    // Validate the parsed response
    if (!parsed.description || !parsed.macros || 
        typeof parsed.macros.calories !== 'number' ||
        typeof parsed.macros.protein !== 'number' ||
        typeof parsed.macros.fat !== 'number' ||
        typeof parsed.macros.carbs !== 'number') {
      throw new Error('Invalid response structure from OpenAI');
    }

    return parsed;
  } catch (error) {
    // Log detailed error for debugging
    console.error('Error analyzing food image:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
}
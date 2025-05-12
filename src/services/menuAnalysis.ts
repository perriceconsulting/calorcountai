import OpenAI from 'openai';
import type { FoodAnalysis } from '../types/food';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeMenu(imageData: string): Promise<FoodAnalysis[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this menu image and extract all food items with their nutritional information. Format as JSON array with items containing: description and macros (calories, protein, fat, carbs)."
            },
            {
              type: "image_url",
              image_url: { url: imageData }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : [];
  } catch (error) {
    console.error('Menu analysis failed:', error);
    return [];
  }
}
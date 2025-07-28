// Client-side wrapper calling Netlify Function for image analysis
import type { FoodAnalysis } from '../types/food';

export async function analyzeFoodImage(dataURL: string): Promise<FoodAnalysis | null> {
  try {
    const res = await fetch('/.netlify/functions/analyze-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataURL }),
    });
    if (!res.ok) {
      throw new Error(`Analysis API error: ${res.status} ${res.statusText}`);
    }
    const data: FoodAnalysis = await res.json();
    return data;
  } catch (err) {
    console.error('analyzeFoodImage error:', err);
    return null;
  }
}
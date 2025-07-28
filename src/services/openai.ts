// Client-side wrapper calling Netlify Function for image analysis
import type { FoodAnalysis } from '../types/food';

// Base URL for Netlify functions (override via VITE_API_BASE_URL if needed)
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const ANALYZE_FOOD_URL = `${API_BASE}/.netlify/functions/analyze-food`;

export async function analyzeFoodImage(dataURL: string): Promise<FoodAnalysis | null> {
  try {
    const res = await fetch(ANALYZE_FOOD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataURL }),
    });
    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(`Analysis API error: ${res.status} ${res.statusText} - ${errMsg}`);
    }
    return await res.json() as FoodAnalysis;
  } catch (err) {
    console.error('analyzeFoodImage error:', err);
    throw err instanceof Error ? err : new Error('Unknown error');
  }
}
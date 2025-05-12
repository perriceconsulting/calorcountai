import { supabase } from '../lib/supabase';
import type { FoodAnalysis } from '../types/food';

export async function lookupFoodByBarcode(barcode: string): Promise<FoodAnalysis | null> {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      description: data.name,
      macros: {
        calories: data.calories,
        protein: data.protein,
        fat: data.fat,
        carbs: data.carbs
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Food lookup error:', error);
    return null;
  }
}
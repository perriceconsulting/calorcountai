import type { MacroNutrients } from '../types/food';
import type { MacroGoals } from '../types/goals';

export function getGoalStatus(macros: MacroNutrients, goals: MacroGoals): 'success' | 'fail' | 'none' {
  if (!macros || !goals) return 'none';
  
  const hasMetAllGoals = 
    macros.calories >= goals.calories &&
    macros.protein >= goals.protein &&
    macros.fat >= goals.fat &&
    macros.carbs >= goals.carbs;
    
  return hasMetAllGoals ? 'success' : 'fail';
}

export function calculateMacroRatio(goals: MacroGoals) {
  const proteinCals = goals.protein * 4;
  const fatCals = goals.fat * 9;
  const carbsCals = goals.carbs * 4;
  const totalCals = proteinCals + fatCals + carbsCals;

  return {
    protein: Math.round((proteinCals / totalCals) * 100) || 0,
    fat: Math.round((fatCals / totalCals) * 100) || 0,
    carbs: Math.round((carbsCals / totalCals) * 100) || 0,
  };
}

export function getMacroFeedback(goals: MacroGoals) {
  const ratio = calculateMacroRatio(goals);
  const feedback: any = {};

  // Calorie feedback
  if (goals.calories < 1200) {
    feedback.calories = {
      type: 'warning',
      message: 'Calories seem too low for sustainable nutrition'
    };
  } else if (goals.calories > 4000) {
    feedback.calories = {
      type: 'warning',
      message: 'High calorie goal - ensure this matches your needs'
    };
  }

  // Protein feedback
  if (ratio.protein < 15) {
    feedback.protein = {
      type: 'warning',
      message: 'Consider increasing protein for better satiety and muscle maintenance'
    };
  } else if (ratio.protein > 40) {
    feedback.protein = {
      type: 'info',
      message: 'High protein intake - ensure adequate water intake'
    };
  }

  // Fat feedback
  if (ratio.fat < 20) {
    feedback.fat = {
      type: 'warning',
      message: 'Fat intake may be too low for hormone production'
    };
  } else if (ratio.fat > 40) {
    feedback.fat = {
      type: 'warning',
      message: 'Consider reducing fat intake for better macro balance'
    };
  }

  // Carbs feedback
  if (ratio.carbs < 20) {
    feedback.carbs = {
      type: 'info',
      message: 'Low-carb approach - monitor energy levels'
    };
  } else if (ratio.carbs > 65) {
    feedback.carbs = {
      type: 'info',
      message: 'High-carb approach - ensure adequate fiber intake'
    };
  }

  // Overall distribution feedback
  const isBalanced = ratio.protein >= 20 && ratio.protein <= 35 &&
                    ratio.fat >= 20 && ratio.fat <= 35 &&
                    ratio.carbs >= 30 && ratio.carbs <= 50;

  if (isBalanced) {
    feedback.overall = {
      type: 'success',
      message: 'Well-balanced macro distribution'
    };
  } else {
    feedback.overall = {
      type: 'info',
      message: `Current ratio: ${ratio.protein}/${ratio.fat}/${ratio.carbs} (Protein/Fat/Carbs)`
    };
  }

  return feedback;
}
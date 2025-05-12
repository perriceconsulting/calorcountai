import type { MacroGoals } from '../types/goals';

interface MacroPreset {
  name: string;
  shortDesc: string;
  description: string;
  macros: MacroGoals;
}

export const MACRO_PRESETS: Record<string, MacroPreset> = {
  balanced: {
    name: 'Balanced',
    shortDesc: '40/30/30 split',
    description: 'A balanced approach suitable for most people, with moderate carbs, protein, and healthy fats.',
    macros: {
      calories: 2000,
      protein: 150,
      fat: 67,
      carbs: 200,
    }
  },
  lowCarb: {
    name: 'Low Carb',
    shortDesc: 'Under 100g carbs',
    description: 'Higher fat and protein with restricted carbs. Good for blood sugar control and weight loss.',
    macros: {
      calories: 2000,
      protein: 175,
      fat: 133,
      carbs: 50,
    }
  },
  keto: {
    name: 'Ketogenic',
    shortDesc: 'Very low carb',
    description: 'Very low carb, high fat diet that can help with weight loss and metabolic health.',
    macros: {
      calories: 2000,
      protein: 150,
      fat: 155,
      carbs: 25,
    }
  },
  highProtein: {
    name: 'High Protein',
    shortDesc: 'For muscle gain',
    description: 'Higher protein intake to support muscle growth and recovery. Ideal for strength training.',
    macros: {
      calories: 2500,
      protein: 200,
      fat: 83,
      carbs: 250,
    }
  },
  mediterranean: {
    name: 'Mediterranean',
    shortDesc: 'Heart healthy',
    description: 'Emphasizes healthy fats, moderate protein, and complex carbs. Great for heart health.',
    macros: {
      calories: 2000,
      protein: 125,
      fat: 78,
      carbs: 225,
    }
  },
  plantBased: {
    name: 'Plant Based',
    shortDesc: 'Higher carb',
    description: 'Higher in complex carbs, moderate protein from plant sources. Suitable for vegan diets.',
    macros: {
      calories: 2000,
      protein: 100,
      fat: 55,
      carbs: 275,
    }
  }
} as const;
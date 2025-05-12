// Core application constants
export const STORAGE_KEYS = {
  FOOD_STORE: 'food-store',
  GOALS_STORE: 'macro-goals',
  HEALTH_STORE: 'health-store',
  SOCIAL_STORE: 'social-store'
} as const;

export const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  fat: 65,
  carbs: 250,
};

export const LIMITS = {
  WATER_GOAL: 8,
  MAX_FOOD_ENTRIES: 100,
  MAX_IMAGE_SIZE: 50 * 1024, // 50KB
  MAX_HISTORY_DAYS: 30
} as const;

export const API_CONFIG = {
  OPENAI_MODEL: 'gpt-4-vision-preview',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.3
} as const;
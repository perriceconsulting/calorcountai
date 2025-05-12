export interface Exercise {
  activity: string;
  duration: number;
  calories: number;
}

export const EXERCISE_TYPES = [
  'Walking',
  'Running',
  'Cycling',
  'Swimming',
  'Weight Training',
  'Yoga',
  'HIIT',
  'Pilates',
  'Dancing',
  'Other'
] as const;
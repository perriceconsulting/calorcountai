export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold';
  icon: string;
  requiredPoints: number;
}

export interface Streaks {
  mealLogging: number;
  waterTracking: number;
}

export interface UserProgress {
  points: number;
  achievements: string[];
  badges: string[];
  streaks: Streaks;
}
export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  type: 'protein' | 'calories' | 'consistency';
}

export interface Leader {
  id: string;
  name: string;
  score: number;
}
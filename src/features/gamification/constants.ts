import type { Achievement, Badge } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-meal',
    title: 'First Meal',
    description: 'Log your first meal',
    icon: 'utensils',
    points: 50
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Log meals for 7 days in a row',
    icon: 'calendar',
    points: 100
  },
  {
    id: 'hydration-master',
    title: 'Hydration Master',
    description: 'Meet water goals for 5 days',
    icon: 'droplet',
    points: 75
  },
  {
    id: 'consistency-champ',
    title: 'Consistency Champ',
    description: 'Complete all daily challenges before reset',
    icon: 'trophy',
    points: 150
  },
  {
    id: 'barcode-pro',
    title: 'Barcode Pro',
    description: 'Scan 10 different products',
    icon: 'scan',
    points: 100
  }
];

export const BADGES: Badge[] = [
  {
    id: 'novice',
    name: 'Nutrition Novice',
    description: 'Start your journey',
    tier: 'bronze',
    icon: 'award',
    requiredPoints: 0
  },
  {
    id: 'enthusiast',
    name: 'Health Enthusiast',
    description: 'Reach 500 points',
    tier: 'silver',
    icon: 'award',
    requiredPoints: 500
  },
  {
    id: 'master',
    name: 'Wellness Master',
    description: 'Reach 1000 points',
    tier: 'gold',
    icon: 'award',
    requiredPoints: 1000
  }
];

export const POINT_VALUES = {
  MEAL_LOG: 10,
  WATER_GOAL: 5,
  STREAK_BONUS: 20,
  FEATURE_USE: {
    BARCODE: 15,
    VOICE: 15,
    MENU: 15
  }
} as const;
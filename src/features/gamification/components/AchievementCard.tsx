import React from 'react';
import { Award, Lock } from 'lucide-react';
import type { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export function AchievementCard({ achievement, isUnlocked }: AchievementCardProps) {
  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-colors
      ${isUnlocked ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}
    `}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium">{achievement.title}</h3>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
        {isUnlocked ? (
          <Award className="w-5 h-5 text-green-500" />
        ) : (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-blue-600 font-medium">
          +{achievement.points} points
        </span>
        {achievement.unlockedAt && (
          <span className="text-gray-500">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
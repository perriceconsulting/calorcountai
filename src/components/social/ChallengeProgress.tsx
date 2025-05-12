import React from 'react';
import type { Challenge } from '../../types/social';

interface ChallengeProgressProps {
  challenge: Challenge;
}

export function ChallengeProgress({ challenge }: ChallengeProgressProps) {
  const progress = Math.min((challenge.currentValue / challenge.targetValue) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium">
          {challenge.currentValue} / {challenge.targetValue} {challenge.unit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
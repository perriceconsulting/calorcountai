import React from 'react';
import { Medal, Flame, TrendingUp } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  rank: number;
}

export function LeaderboardCard({ entry, rank }: LeaderboardCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        {rank <= 3 && (
          <Medal className={`w-5 h-5 ${
            rank === 1 ? 'text-yellow-500' :
            rank === 2 ? 'text-gray-400' :
            'text-amber-600'
          }`} />
        )}
        
        <div>
          <p className="font-medium">{entry.name}</p>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              {entry.streak} day streak
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {entry.progress}% complete
            </span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold">{entry.score}</p>
        <p className="text-sm text-gray-600">points</p>
      </div>
    </div>
  );
}
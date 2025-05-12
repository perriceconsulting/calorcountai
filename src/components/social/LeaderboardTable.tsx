import React from 'react';
import { Medal } from 'lucide-react';
import { useLeaderboard } from '../../hooks/useLeaderboard';

interface LeaderboardTableProps {
  challengeId?: string;
}

export function LeaderboardTable({ challengeId }: LeaderboardTableProps) {
  const { leaders, isLoading } = useLeaderboard(challengeId);

  if (isLoading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
      <div className="space-y-4">
        {leaders.map((leader, index) => (
          <div
            key={leader.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {index < 3 && (
                <Medal className={`w-5 h-5 ${
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-gray-400' :
                  'text-amber-600'
                }`} />
              )}
              <span className={index < 3 ? 'font-medium' : ''}>
                {leader.name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold">{leader.score}</span>
              <span className="text-sm text-gray-500 ml-1">points</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
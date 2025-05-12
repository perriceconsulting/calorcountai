import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardTable } from './LeaderboardTable';
import { Challenges } from './Challenges';
import { useSocialStore } from '../../store/socialStore';

export function LeaderboardPage() {
  const { activeChallenge } = useSocialStore();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-center mb-8">
        <Trophy className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Challenges />
        <LeaderboardTable challengeId={activeChallenge?.id} />
      </div>
    </div>
  );
}
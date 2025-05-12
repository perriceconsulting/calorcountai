import React from 'react';
import { Target, Clock } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import { ChallengeProgress } from './ChallengeProgress';

export function Challenges() {
  const { challenges, activeChallenge, joinChallenge } = useSocialStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
      <div className="space-y-4">
        {challenges.map(challenge => (
          <div
            key={challenge.id}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{challenge.title}</h3>
                <p className="text-sm text-gray-600">{challenge.description}</p>
              </div>
              <Target className={`w-5 h-5 ${
                challenge.id === activeChallenge?.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Clock className="w-4 h-4" />
              <span>{challenge.duration} days remaining</span>
            </div>

            {challenge.id === activeChallenge?.id ? (
              <ChallengeProgress challenge={challenge} />
            ) : (
              <button
                onClick={() => joinChallenge(challenge.id)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join Challenge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
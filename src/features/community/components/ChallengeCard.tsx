import React from 'react';
import { Trophy, Users, Calendar } from 'lucide-react';
import type { Challenge } from '../types';
import { formatDate } from '../../../utils/dateUtils';

interface ChallengeCardProps {
  challenge: Challenge;
  isActive: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export function ChallengeCard({ challenge, isActive, onJoin, onLeave }: ChallengeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{challenge.title}</h3>
          <p className="text-gray-600 text-sm">{challenge.description}</p>
        </div>
        <Trophy className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{challenge.participants} participants</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(new Date(challenge.startDate))} - {formatDate(new Date(challenge.endDate))}</span>
        </div>

        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {challenge.progress}%
            </span>
          </div>
          <div className="flex h-2 mb-4 overflow-hidden bg-blue-100 rounded">
            <div
              style={{ width: `${challenge.progress}%` }}
              className="flex flex-col justify-center bg-blue-600 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {isActive ? (
        <button
          onClick={onLeave}
          className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
        >
          Leave Challenge
        </button>
      ) : (
        <button
          onClick={onJoin}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Join Challenge
        </button>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { useCommunityStore } from '../store/communityStore';
import { ChallengeCard } from './ChallengeCard';
import { InfoTooltip } from '../../../components/shared/InfoTooltip';

export function ChallengeList() {
  const { challenges, activeChallenges, joinChallenge, leaveChallenge } = useCommunityStore();
  const [filter, setFilter] = useState<'all' | 'public' | 'private' | 'family'>('all');
  const [search, setSearch] = useState('');

  const filteredChallenges = challenges
    .filter(challenge => 
      filter === 'all' || challenge.type === filter
    )
    .filter(challenge =>
      challenge.title.toLowerCase().includes(search.toLowerCase()) ||
      challenge.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">All Challenges</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="family">Family</option>
          </select>
          <InfoTooltip content="Filter challenges by type" />
        </div>
      </div>

      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No challenges found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isActive={activeChallenges.includes(challenge.id)}
              onJoin={() => joinChallenge(challenge.id)}
              onLeave={() => leaveChallenge(challenge.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
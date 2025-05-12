import React from 'react';
import { Users, Trophy, Target } from 'lucide-react';
import { useCommunityStore } from '../store/communityStore';

export function CommunityStats() {
  const { challenges, activeChallenges } = useCommunityStore();
  
  const totalParticipants = challenges.reduce((sum, c) => sum + c.participants, 0);
  const completionRate = Math.round(
    (challenges.reduce((sum, c) => sum + c.progress, 0) / (challenges.length || 1))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={Users}
        label="Active Users"
        value={totalParticipants.toString()}
        description="People participating in challenges"
      />
      <StatCard
        icon={Trophy}
        label="Active Challenges"
        value={activeChallenges.length.toString()}
        description="Challenges you're participating in"
      />
      <StatCard
        icon={Target}
        label="Average Completion"
        value={`${completionRate}%`}
        description="Overall challenge completion rate"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}

function StatCard({ icon: Icon, label, value, description }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-gray-600">{label}</h3>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
import React from 'react';
import { Award } from 'lucide-react';
import type { Badge } from '../types';

interface BadgeDisplayProps {
  badge: Badge;
  isEarned: boolean;
}

export function BadgeDisplay({ badge, isEarned }: BadgeDisplayProps) {
  return (
    <div className={`
      p-4 rounded-lg text-center transition-colors
      ${isEarned ? getBadgeStyles(badge.tier) : 'bg-gray-50'}
    `}>
      <Award className={`w-8 h-8 mx-auto mb-2 ${isEarned ? getBadgeIconColor(badge.tier) : 'text-gray-400'}`} />
      <h3 className="font-medium mb-1">{badge.name}</h3>
      <p className="text-sm text-gray-600">{badge.description}</p>
      {!isEarned && (
        <p className="text-sm text-blue-600 mt-2">
          {badge.requiredPoints} points needed
        </p>
      )}
    </div>
  );
}

function getBadgeStyles(tier: Badge['tier']) {
  switch (tier) {
    case 'gold': return 'bg-yellow-50';
    case 'silver': return 'bg-gray-100';
    default: return 'bg-amber-50';
  }
}

function getBadgeIconColor(tier: Badge['tier']) {
  switch (tier) {
    case 'gold': return 'text-yellow-500';
    case 'silver': return 'text-gray-500';
    default: return 'text-amber-600';
  }
}
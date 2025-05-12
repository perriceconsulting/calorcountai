import React from 'react';
import { Share2 } from 'lucide-react';
import type { Achievement } from '../types';

interface ShareAchievementProps {
  achievement: Achievement;
}

export function ShareAchievement({ achievement }: ShareAchievementProps) {
  const handleShare = async () => {
    const text = `I just earned the "${achievement.title}" achievement in AI Food Tracker! 🎉`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Achievement Unlocked!',
          text,
          url: window.location.origin
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
}
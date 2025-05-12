import { useState, useEffect } from 'react';
import { useAchievementStore } from '../store/achievementStore';

export function usePointsAnimation() {
  const [animation, setAnimation] = useState<{ points: number; message: string } | null>(null);
  const { progress } = useAchievementStore();

  useEffect(() => {
    const lastPoints = localStorage.getItem('lastPoints');
    const currentPoints = progress.points.toString();

    if (lastPoints && lastPoints !== currentPoints) {
      const diff = progress.points - parseInt(lastPoints);
      if (diff > 0) {
        setAnimation({ points: diff, message: 'Points earned!' });
        setTimeout(() => setAnimation(null), 2000);
      }
    }

    localStorage.setItem('lastPoints', currentPoints);
  }, [progress.points]);

  return animation;
}
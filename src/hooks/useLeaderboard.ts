import { useState, useEffect, useRef } from 'react';
import type { Leader } from '../types/social';
import { useSocialStore } from '../store/socialStore';

export function useLeaderboard(challengeId?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const { getLeaderboard } = useSocialStore();
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await getLeaderboard(challengeId);
        if (mountedRef.current) {
          setLeaders(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      mountedRef.current = false;
    };
  }, [challengeId, getLeaderboard]);

  return { leaders, isLoading };
}
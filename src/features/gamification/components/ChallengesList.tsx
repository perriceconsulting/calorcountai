import { useChallengesStore } from '../store/challengesStore';
import { useAchievementStore } from '../store/achievementStore';
import { useToastStore } from '../../../store/toastStore';
import { POINT_VALUES } from '../constants';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ChallengesList() {
  const { challenges, claim } = useChallengesStore();
  const addPoints = useAchievementStore(s => s.addPoints);
  const addToast = useToastStore(s => s.addToast);


  if (!challenges.length) return null;

  type Challenge = {
    id: string;
    title: string;
    description: string;
    metric: string;
    goal: number;
    progress: number;
    completed: boolean;
    claimed: boolean;
  };

  const handleClaim = (ch: Challenge) => {
    // award points based on metric
    const points = ch.metric === 'mealLogs'
      ? ch.goal * POINT_VALUES.MEAL_LOG
      : ch.goal * POINT_VALUES.WATER_GOAL;
    claim(ch.id);
    addPoints(points);
    addToast(`Earned ${points} points for "${ch.title}"!`, 'success');
    // celebration effect
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Challenges</h2>
      </div>
      <ul className="space-y-4">
        {challenges.map(ch => {
          const progressPercent = Math.min(100, (ch.progress / ch.goal) * 100);
          return (
            <li key={ch.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-medium">{ch.title}</h3>
                  <p className="text-sm text-gray-500">{ch.description}</p>
                </div>
                {ch.completed && !ch.claimed && (
                  <button
                    onClick={() => handleClaim(ch)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                  >
                    Claim
                  </button>
                )}
                {ch.claimed && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-blue-600 h-2 rounded"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {ch.progress}/{ch.goal}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

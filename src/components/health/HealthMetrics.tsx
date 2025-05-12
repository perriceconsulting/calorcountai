import React from 'react';
import { Scale, TrendingDown, Target } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';
import { useDailyMacros } from '../../hooks/useDailyMacros';
import { InfoTooltip } from '../accessibility/Tooltip';

export function HealthMetrics() {
  const { getGoalsForDate } = useGoalsStore();
  const goals = getGoalsForDate(new Date());
  const consumed = useDailyMacros();

  if (!goals) return null;

  const deficit = goals.calories - consumed.calories;
  const weeklyDeficit = deficit * 7;
  const potentialWeightLoss = Math.round((weeklyDeficit / 3500) * 10) / 10; // 3500 calories = 1 pound

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-green-500" />
          <h3 className="font-medium">Health Insights</h3>
          <InfoTooltip content="Based on your current goals and consumption" />
        </div>
      </div>

      <div className="space-y-2">
        {deficit > 0 && (
          <InsightCard
            icon={TrendingDown}
            color="text-blue-600"
            title="Calorie Deficit"
            description={`You're on track for a ${deficit} calorie deficit today`}
          />
        )}
        
        {potentialWeightLoss > 0 && (
          <InsightCard
            icon={Target}
            color="text-green-600"
            title="Weekly Projection"
            description={`Current pace suggests ~${potentialWeightLoss} lbs loss per week`}
          />
        )}
      </div>
    </div>
  );
}

interface InsightCardProps {
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
}

function InsightCard({ icon: Icon, color, title, description }: InsightCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="font-medium text-sm">{title}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
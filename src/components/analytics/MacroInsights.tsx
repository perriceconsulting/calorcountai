import React from 'react';
import { TrendingUp, Target, AlertCircle } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGoalsStore } from '../../store/goalsStore';
import { InfoTooltip } from '../accessibility/Tooltip';
import type { MacroGoals } from '../../types/goals';

export function MacroInsights() {
  const analytics = useAnalytics();
  const { setGoalsForDate } = useGoalsStore();

  if (!analytics?.trends) return null;

  const { averages } = analytics.trends;
  const suggestedGoals: MacroGoals = {
    calories: Math.round(averages.calories),
    protein: Math.round(averages.protein),
    fat: Math.round(averages.fat),
    carbs: Math.round(averages.carbs)
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Macro Insights</h2>
        <InfoTooltip content="Suggestions based on your tracking history" />
      </div>

      <div className="space-y-4">
        <InsightCard
          icon={Target}
          title="Goal Alignment"
          message={`Your average protein intake is ${suggestedGoals.protein}g, suggesting this might be a more realistic target.`}
          action={{
            label: "Adjust Goals",
            onClick: () => setGoalsForDate(new Date(), suggestedGoals)
          }}
        />

        {analytics.trends.adherence.calories < 80 && (
          <InsightCard
            icon={AlertCircle}
            title="Goal Achievement"
            message="You're meeting your calorie goals less than 80% of the time. Consider adjusting your targets for better consistency."
            variant="warning"
          />
        )}
      </div>
    </div>
  );
}

interface InsightCardProps {
  icon: React.ElementType;
  title: string;
  message: string;
  variant?: 'default' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

function InsightCard({ icon: Icon, title, message, variant = 'default', action }: InsightCardProps) {
  return (
    <div className={`rounded-lg p-4 ${
      variant === 'warning' ? 'bg-yellow-50' : 'bg-gray-50'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${
          variant === 'warning' ? 'text-yellow-600' : 'text-blue-600'
        }`} />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
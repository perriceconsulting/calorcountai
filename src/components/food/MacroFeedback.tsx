import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';
import { useDailyMacros } from '../../hooks/useDailyMacros';

export function MacroFeedback() {
  const { getGoalsForDate } = useGoalsStore();
  const goals = getGoalsForDate(new Date());
  const consumed = useDailyMacros();

  // Early return if no goals are set
  if (!goals) {
    return null;
  }

  const getFeedback = () => {
    const feedback = [];

    if (consumed.calories > goals.calories) {
      feedback.push({
        type: 'warning',
        message: 'You\'ve exceeded your calorie goal',
      });
    }


    if (consumed.fat > goals.fat * 1.2) {
      feedback.push({
        type: 'warning',
        message: 'Consider reducing fat intake for remaining meals',
      });
    }

    if (feedback.length === 0 && consumed.calories > 0) {
      feedback.push({
        type: 'success',
        message: 'You\'re on track with your macro goals!',
      });
    }

    return feedback;
  };

  const feedback = getFeedback();
  if (feedback.length === 0) return null;

  return (
    <div className="space-y-2">
      {feedback.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 p-3 rounded-lg ${
            item.type === 'warning'
              ? 'bg-yellow-50 text-yellow-800'
              : item.type === 'info'
              ? 'bg-blue-50 text-blue-800'
              : 'bg-green-50 text-green-800'
          }`}
        >
          {item.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm">{item.message}</p>
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useAnalytics } from '../../hooks/useAnalytics';
import { InfoTooltip } from '../accessibility/Tooltip';

export function MacroTrends() {
  const analytics = useAnalytics();

  if (!analytics?.weeklyProgress) {
    return null;
  }

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories',
        data: analytics.weeklyProgress.map(day => day.calories),
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Weekly Trends</h2>
          <InfoTooltip content="Your calorie intake over the past week" />
        </div>
      </div>

      <Line data={data} options={options} />

      {analytics.trends && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Daily Calories</p>
            <p className="text-xl font-semibold">
              {Math.round(analytics.trends.averages.calories)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Goal Adherence</p>
            <p className="text-xl font-semibold">
              {Math.round(analytics.trends.adherence.calories)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
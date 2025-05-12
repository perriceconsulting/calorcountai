import React from 'react';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';
import { useCalendarInsights } from '../../hooks/useCalendarInsights';

export function CalendarInsights() {
  const { successRate, streak, bestDay } = useCalendarInsights();

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <InsightCard
        icon={Trophy}
        label="Success Rate"
        value={`${successRate}%`}
        description="of goals met this month"
      />
      <InsightCard
        icon={TrendingUp}
        label="Current Streak"
        value={streak.toString()}
        description="days meeting goals"
      />
      <InsightCard
        icon={Calendar}
        label="Best Day"
        value={bestDay.date}
        description={`${bestDay.percentage}% of goals met`}
      />
    </div>
  );
}

interface InsightCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}

function InsightCard({ icon: Icon, label, value, description }: InsightCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-blue-600" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
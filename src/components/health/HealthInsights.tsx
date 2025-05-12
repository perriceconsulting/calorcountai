import React from 'react';
import { Activity } from 'lucide-react';
import { WaterTracker } from './WaterTracker';
import { ExerciseTracker } from './ExerciseTracker';
import { HealthMetrics } from './HealthMetrics';
import { InfoTooltip } from '../accessibility/Tooltip';

export function HealthInsights() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Health & Activity</h2>
          <InfoTooltip content="Track your daily health metrics and activities" />
        </div>
      </div>

      <div className="space-y-6">
        <HealthMetrics />
        <div className="border-t pt-6">
          <WaterTracker />
        </div>
        <div className="border-t pt-6">
          <ExerciseTracker />
        </div>
      </div>
    </div>
  );
}
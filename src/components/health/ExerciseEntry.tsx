import React from 'react';
import { Clock, Flame } from 'lucide-react';
import type { Exercise } from '../../types/health';

interface ExerciseEntryProps {
  exercise: Exercise;
}

export function ExerciseEntry({ exercise }: ExerciseEntryProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-medium">{exercise.activity}</h4>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {exercise.duration} min
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4" />
            {exercise.calories} cal
          </div>
        </div>
      </div>
    </div>
  );
}
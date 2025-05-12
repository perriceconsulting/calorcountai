import React, { useState } from 'react';
import { Activity, Plus } from 'lucide-react';
import { useHealthStore } from '../../store/healthStore';
import { ExerciseEntry } from './ExerciseEntry';
import { AddExerciseModal } from './AddExerciseModal';
import { InfoTooltip } from '../accessibility/Tooltip';

export function ExerciseTracker() {
  const [showModal, setShowModal] = useState(false);
  const { exercises } = useHealthStore();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500" />
          <h3 className="font-medium">Exercise Log</h3>
          <InfoTooltip content="Track your daily physical activities" />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      <div className="space-y-3">
        {exercises.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No activities logged today
          </p>
        ) : (
          exercises.map((exercise, index) => (
            <ExerciseEntry key={index} exercise={exercise} />
          ))
        )}
      </div>

      {showModal && (
        <AddExerciseModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useHealthStore } from '../../store/healthStore';
import { EXERCISE_TYPES } from '../../types/health';

interface AddExerciseModalProps {
  onClose: () => void;
}

export function AddExerciseModal({ onClose }: AddExerciseModalProps) {
  const [activity, setActivity] = useState(EXERCISE_TYPES[0]);
  const [duration, setDuration] = useState(30);
  const { addExercise } = useHealthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calories = Math.round(duration * 5); // Simple calculation
    addExercise({ activity, duration, calories });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Add Exercise</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Type
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {EXERCISE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors"
          >
            Add Exercise
          </button>
        </form>
      </div>
    </div>
  );
}
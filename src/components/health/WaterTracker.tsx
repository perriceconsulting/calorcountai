import { Droplet, Plus, Minus } from 'lucide-react';
import { useHealthStore } from '../../store/healthStore';
import { InfoTooltip } from '../accessibility/Tooltip';

export function WaterTracker() {
  const { waterIntake, addWater, removeWater } = useHealthStore();
  const GLASS_OZ = 8;
  const DAILY_GOAL_OZ = 8 * GLASS_OZ; // 64 oz per day
  const progress = (waterIntake / DAILY_GOAL_OZ) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">Water Intake</h3>
          <InfoTooltip content="Track glasses of water (250ml each)" />
        </div>
        <div className="text-sm text-gray-600">
          Goal: {DAILY_GOAL_OZ} oz
        </div>
      </div>

      <div className="relative pt-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-semibold inline-block text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeWater()}
              disabled={waterIntake === 0}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              aria-label="Decrease water intake"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-semibold min-w-[3ch] text-center">
              {waterIntake}
            </span>
            <button
              onClick={() => addWater()}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Increase water intake"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex h-2 mb-4 overflow-hidden bg-blue-100 rounded">
          <div
            style={{ width: `${Math.min(progress, 100)}%` }}
            className="flex flex-col justify-center bg-blue-500 transition-all duration-300"
          />
        </div>
        <p className="text-xs text-gray-500 text-center">
          {waterIntake === 0 
            ? "Track your water intake by clicking + above"
            : `${DAILY_GOAL_OZ - waterIntake} oz to reach your goal`
          }
        </p>
      </div>
    </div>
  );
}
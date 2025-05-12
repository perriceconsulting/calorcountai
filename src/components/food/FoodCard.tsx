import React from 'react';
import { Clock } from 'lucide-react';
import type { FoodAnalysis } from '../../types/food';
import { MEAL_LABELS } from '../../types/meals';
import { formatTime } from '../../utils/dateUtils';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

interface FoodCardProps {
  food: FoodAnalysis;
}

export function FoodCard({ food }: FoodCardProps) {
  const { isMobile } = useDeviceCapabilities();
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="flex items-start gap-3 sm:gap-4 bg-white rounded-lg shadow p-3 sm:p-4">
      {food.imageUrl && !imageError && (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
          <img
            src={food.imageUrl}
            alt={food.description}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between mb-2">
          <p className="text-base sm:text-lg font-medium truncate">{food.description}</p>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 shrink-0 ml-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{formatTime(new Date(food.timestamp!))}</span>
          </div>
        </div>
        
        {food.mealType && (
          <span className="inline-block px-2 py-0.5 mb-2 text-xs font-medium bg-blue-50 text-blue-700 rounded">
            {MEAL_LABELS[food.mealType]}
          </span>
        )}
        
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <MacroItem label="Calories" value={food.macros.calories} />
          <MacroItem label="Protein" value={food.macros.protein} unit="g" />
          <MacroItem label="Fat" value={food.macros.fat} unit="g" />
          <MacroItem label="Carbs" value={food.macros.carbs} unit="g" />
        </div>
      </div>
    </div>
  );
}

interface MacroItemProps {
  label: string;
  value: number;
  unit?: string;
}

function MacroItem({ label, value, unit = '' }: MacroItemProps) {
  const { isMobile } = useDeviceCapabilities();
  
  return (
    <div>
      <p className={`text-xs sm:text-sm text-gray-500 ${isMobile ? 'mb-0.5' : 'mb-1'}`}>{label}</p>
      <p className="font-semibold text-sm sm:text-base">
        {value}
        {unit}
      </p>
    </div>
  );
}
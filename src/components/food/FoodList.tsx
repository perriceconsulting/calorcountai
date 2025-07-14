import { Utensils, Camera } from 'lucide-react';
import { useFoodStore } from '../../store/foodStore';
import { useDateStore } from '../../store/dateStore';
import { FoodCard } from './FoodCard';
import { filterEntriesByDate } from '../../utils/foodUtils';

export function FoodList() {
  const { foodEntries } = useFoodStore();
  const { selectedDate } = useDateStore();
  
  const filteredEntries = filterEntriesByDate(foodEntries, selectedDate);

  if (filteredEntries.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-gray-50 rounded-lg p-8 max-w-sm mx-auto">
          <Utensils className="w-12 h-12 text-blue-600/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
          <p className="text-gray-600 mb-4">
            Start tracking your meals by taking a photo or adding an entry manually
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <Camera className="w-4 h-4" />
            <span>Take a photo to get started</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEntries.map((entry) => (
        <FoodCard key={entry.id} food={entry} />
      ))}
    </div>
  );
}
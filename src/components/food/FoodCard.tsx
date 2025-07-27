import { useState } from 'react';
import { Clock, Trash2, BookOpen, Heart, Camera, Lightbulb } from 'lucide-react';
import type { FoodAnalysis } from '../../types/food';
import { MEAL_LABELS } from '../../types/meals';
import { formatTime } from '../../utils/dateUtils';
// import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'; (removed unused)
import { useFoodStore } from '../../store/foodStore';
import { fetchRecipeFor } from '../../services/recipeService';
import { RecipeModal } from '../recipes/RecipeModal';
import { useToastStore } from '../../store/toastStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { ConfirmModal } from '../shared/ConfirmModal';
import { ImageModal } from '../shared/ImageModal';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface FoodCardProps {
  food: FoodAnalysis;
}

export function FoodCard({ food }: FoodCardProps) {
  const deleteEntry = useFoodStore(s => s.deleteFoodEntry);
  const [imageError, setImageError] = useState(false);
  const [recipe, setRecipe] = useState('');
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isImageOpen, setImageOpen] = useState(false);
  const [recipeLoading, setRecipeLoading] = useState(false);

  // Favorites handling
  const isFav = useFavoritesStore(s => s.isFavorite(food.id!));
  const addFavorite = useFavoritesStore(s => s.addFavorite);
  const removeFavorite = useFavoritesStore(s => s.removeFavorite);
  const addToast = useToastStore(s => s.addToast);
  const handleToggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFavorite(food.id!);
        addToast('Removed from favorites', 'success');
      } else {
        await addFavorite(food.id!);
        addToast('Added to favorites', 'success');
      }
    } catch (err) {
      console.error('Failed to update favorite:', err);
      addToast('Unable to update favorites', 'error');
    }
  };

  const showRecipe = async () => {
    setRecipeLoading(true);
    const text = await fetchRecipeFor(food.description);
    setRecipeLoading(false);
    setRecipe(text);
    setIsRecipeOpen(true);
  };

  // Only allow modifying entries created today
  const entryDate = new Date(food.timestamp!);
  const today = new Date();
  const isTodayEntry = entryDate.toDateString() === today.toDateString();

  // Handler to perform delete after confirmation
  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    try {
      await deleteEntry(food.id!, food.imageUrl);
    } catch (err) {
      console.error('Failed to delete entry:', err);
      addToast('Failed to delete entry', 'error');
    }
  };
  // Debug: log image URL
  console.log('FoodCard imageUrl for', food.id, ':', food.imageUrl);

  return (
    <>
      <div className="flex items-start gap-3 sm:gap-4 bg-white rounded-lg shadow p-3 sm:p-4">
        {(food.imageUrl && !imageError) ? (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
            <img
              src={food.imageUrl}
              alt={food.description}
              className="w-full h-full object-cover cursor-zoom-in"
              loading="lazy"
              onError={() => setImageError(true)}
              onClick={() => setImageOpen(true)}
            />
          </div>
        ) : (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
            <Camera className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between mb-2">
            <p className="text-base sm:text-lg font-medium truncate">{food.description}</p>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-500">{formatTime(new Date(food.timestamp!))}</span>
              <button onClick={showRecipe} title="View recipe" className="text-indigo-500 hover:text-indigo-700">
                <BookOpen className="w-4 h-4" />
              </button>
              {isTodayEntry && (
                <button
                  onClick={handleToggleFavorite}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  className={
                    `ml-2 ${isFav ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700'}`
                  }
                >
                  <Heart className="w-4 h-4" />
                </button>
              )}
              {isTodayEntry && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              )}
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

      {/* Loading modal while recipe is being generated */}
      {recipeLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <LoadingSpinner size="lg" className="text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-700">Building Recipe...</p>
          </div>
        </div>
      )}

      <RecipeModal
        isOpen={isRecipeOpen}
        content={recipe}
        onClose={() => setIsRecipeOpen(false)}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      <ImageModal
        isOpen={isImageOpen}
        imageUrl={food.imageUrl!}
        alt={food.description}
        onClose={() => setImageOpen(false)}
      />
    </>
  );
}

interface MacroItemProps {
  label: string;
  value: number;
  unit?: string;
}

function MacroItem({ label, value, unit = '' }: MacroItemProps) {
  return (
    <div>
      <p className="text-xs sm:text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-sm sm:text-base">
        {value}
        {unit}
      </p>
    </div>
  );
}

import React from 'react';
import { X } from 'lucide-react';
import type { FoodAnalysis } from '../../types/food';

interface MenuAnalysisModalProps {
  items: FoodAnalysis[];
  onSelect: (item: FoodAnalysis) => void;
  onClose: () => void;
}

export function MenuAnalysisModal({ items, onSelect, onClose }: MenuAnalysisModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Menu Items</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50"
            >
              <p className="font-medium">{item.description}</p>
              <p className="text-sm text-gray-600">
                {item.macros.calories} cal | {item.macros.protein}g protein
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
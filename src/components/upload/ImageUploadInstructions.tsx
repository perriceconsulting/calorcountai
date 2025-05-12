import React from 'react';
import { Ruler } from 'lucide-react';

export function ImageUploadInstructions() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
      <Ruler className="w-4 h-4 text-blue-600 shrink-0" />
      <p>
        For accurate results, hold your camera approximately 1 foot (30 cm) away from the plate
      </p>
    </div>
  );
}
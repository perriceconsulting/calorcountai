import React from 'react';
import { Camera, Menu } from 'lucide-react';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

interface UploadOptionsProps {
  onCameraClick: () => void;
  onMenuClick: () => void;
}

export function UploadOptions({ onCameraClick, onMenuClick }: UploadOptionsProps) {
  const { isMobile } = useDeviceCapabilities();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <button
        onClick={onCameraClick}
        className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Camera className="w-6 h-6 text-blue-600 mb-2" />
        <span className="text-sm">Take Photo</span>
        <span className="text-xs text-gray-500">Food items</span>
      </button>
      
      <button
        onClick={onMenuClick}
        className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-6 h-6 text-blue-600 mb-2" />
        <span className="text-sm">Scan Menu</span>
        <span className="text-xs text-gray-500">Restaurant menus</span>
      </button>
    </div>
  );
}
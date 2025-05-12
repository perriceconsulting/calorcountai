import React from 'react';
import { Camera, AlertCircle } from 'lucide-react';

interface CameraErrorProps {
  message: string;
}

export function CameraError({ message }: CameraErrorProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black text-white p-4">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Camera Access Error</h3>
      <p className="text-sm text-gray-300 text-center max-w-xs">{message}</p>
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
        <Camera className="w-4 h-4" />
        <span>Please check camera permissions</span>
      </div>
    </div>
  );
}
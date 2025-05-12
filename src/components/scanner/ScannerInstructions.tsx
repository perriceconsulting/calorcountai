import React from 'react';
import { X, RotateCcw, Camera } from 'lucide-react';

interface ScannerInstructionsProps {
  onClose: () => void;
}

export function ScannerInstructions({ onClose }: ScannerInstructionsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-sm text-white p-4 pb-8">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close scanner"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="text-center max-w-xs mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Camera className="w-5 h-5" />
          <h3 className="font-medium">Scan Product Barcode</h3>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Center the barcode within the frame and hold your device steady
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
          <RotateCcw className="w-4 h-4 animate-spin" />
          <span>Scanning automatically...</span>
        </div>
      </div>
    </div>
  );
}
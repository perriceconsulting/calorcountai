import React from 'react';
import { Scan } from 'lucide-react';

interface ScannerOverlayProps {
  isScanning: boolean;
}

export function ScannerOverlay({ isScanning }: ScannerOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`
          w-4/5 max-w-[300px] aspect-[4/3] border-2 rounded-lg
          ${isScanning ? 'border-blue-500 animate-pulse' : 'border-white'}
          transition-colors duration-200
        `}>
          {/* Corner markers */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
          </div>
          
          {/* Scanning indicator */}
          <div className={`
            absolute inset-0 flex items-center justify-center
            ${isScanning ? 'opacity-100' : 'opacity-50'}
            transition-opacity duration-200
          `}>
            <Scan className={`w-8 h-8 ${isScanning ? 'text-blue-500' : 'text-white'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
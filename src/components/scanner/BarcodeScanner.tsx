import React, { useState } from 'react';
import { Camera } from './Camera';
import { ScannerOverlay } from './ScannerOverlay';
import { ScannerInstructions } from './ScannerInstructions';
import { isBarcodeDetectorSupported } from '../../services/barcodeScanner';
import type { MealType } from '../../types/meals';

interface BarcodeScannerProps {
  onClose: () => void;
  onScan: (barcode: string) => void;
  mealType: MealType;
}

export function BarcodeScanner({ onClose, onScan, mealType }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  if (!isBarcodeDetectorSupported()) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2">Browser Not Supported</h3>
          <p className="text-gray-600 mb-4">
            Barcode scanning is not supported in your browser. Please try Chrome or Edge.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <Camera
        onScan={onScan}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
      />
      <ScannerOverlay isScanning={isScanning} />
      <ScannerInstructions onClose={onClose} />
    </div>
  );
}
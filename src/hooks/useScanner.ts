import { useState, useCallback, useEffect } from 'react';
import { scanBarcode } from '../services/barcodeScanner';
import { captureVideoFrame } from '../utils/canvasUtils';

interface UseScannerProps {
  onScan: (barcode: string) => void;
  enabled: boolean;
  interval?: number;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function useScanner({ onScan, enabled, interval = 500, videoRef }: UseScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  const scanFrame = useCallback(async () => {
    if (!videoRef.current || !videoRef.current.videoWidth || isScanning || !enabled) {
      return;
    }

    try {
      setIsScanning(true);
      const imageData = captureVideoFrame(videoRef.current);
      const barcode = await scanBarcode(imageData);
      
      if (barcode) {
        onScan(barcode);
      }
    } catch (error) {
      console.error('Scanning error:', error);
    } finally {
      setIsScanning(false);
    }
  }, [onScan, isScanning, enabled, videoRef]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(scanFrame, interval);
    return () => clearInterval(timer);
  }, [scanFrame, interval, enabled]);

  return { isScanning };
}
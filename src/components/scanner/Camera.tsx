import React from 'react';
import { useCamera } from '../../hooks/useCamera';
import { useScanner } from '../../hooks/useScanner';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { CameraError } from './CameraError';

interface CameraProps {
  onScan: (barcode: string) => void;
  enabled: boolean;
}

export function Camera({ onScan, enabled }: CameraProps) {
  const { videoRef, isLoading, error, startCamera } = useCamera();
  const { isScanning } = useScanner({ onScan, enabled, videoRef });

  React.useEffect(() => {
    startCamera();
  }, [startCamera]);

  if (error) {
    return <CameraError message={error} />;
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" className="text-white" />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="h-full w-full object-cover"
      data-scanning={isScanning}
    />
  );
}
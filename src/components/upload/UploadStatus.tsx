import React from 'react';
import { Loader2 } from 'lucide-react';

interface UploadStatusProps {
  status: 'uploading' | 'analyzing' | 'error' | null;
  error?: string;
}

export function UploadStatus({ status, error }: UploadStatusProps) {
  if (!status) return null;

  return (
    <div className={`
      absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg
      ${status === 'error' ? 'text-red-600' : 'text-blue-600'}
    `}>
      {status !== 'error' && (
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
      )}
      <span className="font-medium">
        {status === 'uploading' && 'Uploading image...'}
        {status === 'analyzing' && 'Analyzing your food...'}
        {status === 'error' && error}
      </span>
    </div>
  );
}
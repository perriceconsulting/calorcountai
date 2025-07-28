import React from 'react';
import { X } from 'lucide-react';
import { ChallengeCreateForm } from '../../../components/challenges/ChallengeCreateForm';

interface CreateChallengeModalProps {
  onClose: () => void;
}

export function CreateChallengeModal({ onClose }: CreateChallengeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Create Challenge</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ChallengeCreateForm onSuccess={onClose} />
      </div>
    </div>
  );
}
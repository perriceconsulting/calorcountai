import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateChallengeModal } from './CreateChallengeModal';

export function CreateChallengeButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        Create Challenge
      </button>

      {showModal && (
        <CreateChallengeModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
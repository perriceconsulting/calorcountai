import React, { useState } from 'react';
import { X, Users, Lock } from 'lucide-react';
import { useCommunityStore } from '../store/communityStore';

interface CreateChallengeModalProps {
  onClose: () => void;
}

export function CreateChallengeModal({ onClose }: CreateChallengeModalProps) {
  const [type, setType] = useState<'public' | 'private' | 'family'>('public');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createChallenge } = useCommunityStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    createChallenge({
      title,
      description,
      type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      goal: {
        type: 'consistency',
        target: 7,
        unit: 'days'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Create Challenge</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Challenge Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setType('public')}
                className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                  type === 'public' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Users className="w-5 h-5 mb-1" />
                <span className="text-sm">Public</span>
              </button>
              <button
                type="button"
                onClick={() => setType('private')}
                className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                  type === 'private' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Lock className="w-5 h-5 mb-1" />
                <span className="text-sm">Private</span>
              </button>
              <button
                type="button"
                onClick={() => setType('family')}
                className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                  type === 'family' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Users className="w-5 h-5 mb-1" />
                <span className="text-sm">Family</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300"
              placeholder="e.g., 7-Day Protein Challenge"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border-gray-300"
              placeholder="Describe your challenge..."
              rows={3}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
          >
            Create Challenge
          </button>
        </form>
      </div>
    </div>
  );
}
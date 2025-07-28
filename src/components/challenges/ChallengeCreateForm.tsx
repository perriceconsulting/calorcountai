import React, { useState } from 'react';
import { useChallengeStore } from '../../store/challengeStore';
import { useToastStore } from '../../store/toastStore';
import type { ChallengeVisibility } from '../../types/challenge';

interface ChallengeCreateFormProps {
  onSuccess?: () => void;
}
export function ChallengeCreateForm({ onSuccess }: ChallengeCreateFormProps) {
  const addChallenge = useChallengeStore((state) => state.addChallenge);
  const fetchPublic = useChallengeStore((state) => state.fetchPublic);
  const fetchMy = useChallengeStore((state) => state.fetchMy);
  const { addToast } = useToastStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<ChallengeVisibility>('public');
  const [inviteCode, setInviteCode] = useState('');
  const [targetPoints, setTargetPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Title is required', 'error');
      return;
    }
    setLoading(true);
    try {
      const code =
        visibility === 'family'
          ? inviteCode || Math.random().toString(36).substr(2, 6).toUpperCase()
          : null;
      const newCh = await addChallenge({
        title: title.trim(),
        description: description.trim() || null,
        visibility,
        invite_code: code,
        target_points: targetPoints,
      });
      if (newCh) {
        addToast('Challenge created', 'success');
        // close modal if provided
        onSuccess?.();
        // refresh lists
        await fetchPublic();
        await fetchMy();
        // reset
        setTitle('');
        setDescription('');
        setVisibility('public');
        setInviteCode('');
        setTargetPoints(0);
      } else {
        addToast('Failed to create challenge', 'error');
      }
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold">Create Challenge</h3>
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Visibility</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as ChallengeVisibility)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="family">Family (invite only)</option>
        </select>
      </div>
      {visibility === 'family' && (
        <div>
          <label className="block text-sm font-medium">Invite Code (optional)</label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="Enter or generate code"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium">Target Points</label>
        <input
          type="number"
          min={0}
          value={targetPoints}
          onChange={(e) => setTargetPoints(Number(e.target.value))}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Challenge'}
      </button>
    </form>
  );
}

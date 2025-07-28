import { useEffect, useState } from 'react';
import { useChallengeStore } from '../../store/challengeStore';
import { useToastStore } from '../../store/toastStore';
import type { Challenge } from '../../types/challenge';

export function ChallengeList() {
  const {
    publicChallenges,
    myChallenges,
    participants,
    loadingPublic,
    loadingMy,
    loadingParticipants,
    fetchPublic,
    fetchMy,
    fetchParticipants,
    join,
    leave,
    error,
  } = useChallengeStore(state => ({
    publicChallenges: state.publicChallenges,
    myChallenges: state.myChallenges,
    participants: state.participants,
    loadingPublic: state.loadingPublic,
    loadingMy: state.loadingMy,
    loadingParticipants: state.loadingParticipants,
    fetchPublic: state.fetchPublic,
    fetchMy: state.fetchMy,
    fetchParticipants: state.fetchParticipants,
    join: state.join,
    leave: state.leave,
    error: state.error,
  }));
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public');

  useEffect(() => {
    fetchPublic().catch(err => addToast(err.message || 'Error loading public challenges', 'error'));
    fetchMy().catch(err => addToast(err.message || 'Error loading my challenges', 'error'));
    fetchParticipants().catch(err => addToast(err.message || 'Error loading your progress', 'error'));
  }, []);

  const challengesToShow: Challenge[] = activeTab === 'public' ? publicChallenges : myChallenges;
  const isLoading = activeTab === 'public' ? loadingPublic : loadingMy;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'public' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('public')}
        >
          Public Challenges
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'my' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('my')}
        >
          My Challenges
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : challengesToShow.length ? (
        <ul className="space-y-4">
          {challengesToShow.map(ch => {
            // find participant record
            const part = participants.find(p => p.challenge_id === ch.id);
            const progress = part?.progress ?? 0;
            const points = part?.points ?? 0;
            const percent = ch.target_points > 0 ? Math.min((progress / ch.target_points) * 100, 100) : 0;
            return (
            <li key={ch.id} className="border rounded-lg p-4">
               <h4 className="text-lg font-semibold">{ch.title}</h4>
              {activeTab === 'my' && ch.target_points > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {progress}/{ch.target_points} progress
                  </p>
                  <p className="text-sm text-gray-600">{points} points</p>
                </div>
              )}
               {ch.description && <p className="text-sm text-gray-700">{ch.description}</p>}
               {ch.target_points > 0 && (
                 <p className="text-sm text-gray-500 mt-1">Target Points: {ch.target_points}</p>
               )}
               <p className="text-xs text-gray-500 mt-1">Visibility: {ch.visibility}</p>
               {ch.visibility === 'family' && ch.invite_code && (
                 <p className="text-xs text-gray-500">Invite Code: {ch.invite_code}</p>
               )}
               {activeTab === 'public' && (
                 (() => {
                   const joined = myChallenges.some(mc => mc.id === ch.id);
                   return (
                     <button
                       onClick={async () => {
                         try {
                           if (joined) {
                             await leave(ch.id);
                             addToast('Left challenge', 'success');
                           } else {
                             await join(ch.id);
                             addToast('Joined challenge', 'success');
                           }
                           // refresh lists
                           await fetchPublic();
                           await fetchMy();
                         } catch (err: any) {
                           addToast(err.message || 'Error updating challenge', 'error');
                         }
                       }}
                       className={`mt-2 px-3 py-1 rounded ${joined ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                     >
                       {joined ? 'Leave' : 'Join'}
                     </button>
                   );
                 })()
               )}
             </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No challenges to display.</p>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

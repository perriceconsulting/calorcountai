import { Trophy, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChallengeStore } from '../../../store/challengeStore';
import { motion } from 'framer-motion';

export function CommunityBanner() {
  const { myChallenges } = useChallengeStore();
  const activeChallenge = myChallenges[0]; // Most recent challenge

  if (!activeChallenge) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white mb-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Weekly Challenge</h2>
          </div>
          <p className="mb-4">{activeChallenge.description}</p>
          <div className="flex items-center gap-4 text-blue-100">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {((activeChallenge as any).participants?.length ?? 0) + '+ participants'}
            </span>
          </div>
        </div>
        <Link
          to="/community"
          className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-colors"
        >
          Join Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
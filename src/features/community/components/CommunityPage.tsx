import React from 'react';
import { Users } from 'lucide-react';
import { ChallengeList } from './ChallengeList';
import { CommunityStats } from './CommunityStats';
import { CreateChallengeButton } from './CreateChallengeButton';
import { PageHeader } from '../../../components/shared/PageHeader';

export function CommunityPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeader
        icon={Users}
        title="Community Challenges"
        description="Join challenges and compete with friends"
      >
        <CreateChallengeButton />
      </PageHeader>

      <CommunityStats />
      
      <div className="mb-8">
        <ChallengeList />
      </div>
    </div>
  );
}
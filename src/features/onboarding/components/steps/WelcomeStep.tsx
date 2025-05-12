import React from 'react';
import { Camera, Utensils, Activity } from 'lucide-react';
import type { StepProps } from '../../types';

export function WelcomeStep({ onNext, username }: StepProps & { username?: string }) {
  const handleGetStarted = () => {
    if (onNext) {
      onNext();
    }
  };

  const displayName = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : 'User';

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to AI Food Tracker</h1>
      <p className="text-lg text-gray-700 font-semibold mb-4">
        Hi {displayName}, let's get started!
      </p>
      <p className="text-gray-600 mb-8">
        Let's set up your personalized nutrition tracking experience
      </p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <FeatureCard
          icon={Camera}
          title="Smart Tracking"
          description="Take photos of your food for instant nutrition analysis"
        />
        <FeatureCard
          icon={Utensils}
          title="Personalized Goals"
          description="Set and track custom macro goals for your needs"
        />
        <FeatureCard
          icon={Activity}
          title="Health Insights"
          description="Get AI-powered insights about your nutrition"
        />
      </div>

      <button
        onClick={handleGetStarted}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg text-center">
      <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

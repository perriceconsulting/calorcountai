import { Camera, Utensils, Activity } from 'lucide-react';
import { memo } from 'react';
import type { StepProps } from '../../types';

type Feature = {
  icon: JSX.Element;
  title: string;
  desc: string;
};

const features: Feature[] = [
    {
      icon: <Camera className="mx-auto h-8 w-8 text-blue-600" />,
      title: 'Smart Tracking',
      desc: 'Take photos of your food for instant nutrition analysis',
    },
    {
      icon: <Utensils className="mx-auto h-8 w-8 text-green-600" />,
      title: 'Personalized Goals',
      desc: 'Set and track custom macro goals for your needs',
    },
    {
      icon: <Activity className="mx-auto h-8 w-8 text-red-600" />,
      title: 'Health Insights',
      desc: 'Get AI-powered insights about your nutrition',
    },
  ];

export const FeatureOverviewStep = memo(({ onNext }: StepProps) => (
  <section aria-labelledby="feature-overview-title">
      <h2 id="feature-overview-title" className="text-2xl font-bold mb-6 text-center">
        What You&apos;ll Get
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {features.map((f) => (
          <li
            key={f.title}
            className="p-4 text-center border rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="mb-2">{f.icon}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Let's Get Started
        </button>
      </div>
    </section>
));
// Set displayName for better debugging
FeatureOverviewStep.displayName = 'FeatureOverviewStep';

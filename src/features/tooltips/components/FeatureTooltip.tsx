import React from 'react';
import { useFeatureTooltip } from '../hooks/useFeatureTooltip';
import type { TooltipConfig } from '../types';

interface FeatureTooltipProps extends TooltipConfig {
  children: React.ReactNode;
}

export function FeatureTooltip({ children, ...config }: FeatureTooltipProps) {
  const tooltip = useFeatureTooltip(config);

  if (!tooltip.show) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {children}
      <div className={`
        absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg
        whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
        ${tooltip.placement === 'top' ? 'bottom-full mb-2' :
          tooltip.placement === 'bottom' ? 'top-full mt-2' :
          tooltip.placement === 'left' ? 'right-full mr-2' :
          'left-full ml-2'}
      `}>
        {tooltip.content}
      </div>
    </div>
  );
}
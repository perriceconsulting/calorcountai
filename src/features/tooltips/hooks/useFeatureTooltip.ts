import { useEffect } from 'react';
import { useTooltipStore } from '../store/tooltipStore';
import type { TooltipConfig } from '../types';

export function useFeatureTooltip(config: TooltipConfig) {
  const { seenTooltips, markTooltipAsSeen } = useTooltipStore();
  const hasSeenTooltip = seenTooltips.includes(config.id);

  useEffect(() => {
    const handleDismiss = () => {
      if (!hasSeenTooltip) {
        markTooltipAsSeen(config.id);
      }
    };

    return () => {
      // Cleanup if needed
    };
  }, [config.id, hasSeenTooltip, markTooltipAsSeen]);

  return {
    show: !hasSeenTooltip,
    placement: config.placement || 'top',
    trigger: config.trigger || 'hover',
    content: config.content,
    onDismiss: () => markTooltipAsSeen(config.id)
  };
}
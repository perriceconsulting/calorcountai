import { useEffect } from 'react';
import { useTooltipStore } from '../store/tooltipStore';
import type { PromptConfig } from '../types';

export function useContextualPrompt(config: PromptConfig) {
  const { 
    dismissedPrompts,
    activePrompt,
    dismissPrompt,
    setActivePrompt
  } = useTooltipStore();

  const isDismissed = dismissedPrompts.includes(config.id);
  const shouldShow = !isDismissed && 
    (!config.condition || config.condition()) &&
    (!activePrompt || activePrompt === config.id);

  useEffect(() => {
    if (shouldShow && !activePrompt) {
      setActivePrompt(config.id);
    }
  }, [shouldShow, activePrompt, config.id, setActivePrompt]);

  return {
    show: shouldShow,
    onDismiss: () => {
      if (config.dismissible !== false) {
        dismissPrompt(config.id);
      }
    }
  };
}
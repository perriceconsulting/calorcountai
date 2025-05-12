import type { ReactNode } from 'react';

export interface TooltipConfig {
  id: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  delay?: number;
}

export interface PromptConfig {
  id: string;
  title: string;
  content: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  condition?: () => boolean;
  dismissible?: boolean;
  priority?: number;
}

export interface TooltipState {
  seenTooltips: string[];
  dismissedPrompts: string[];
  activePrompt: string | null;
}
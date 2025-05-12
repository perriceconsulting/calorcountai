import React from 'react';
import { X } from 'lucide-react';
import { useContextualPrompt } from '../hooks/useContextualPrompt';
import type { PromptConfig } from '../types';

export function ContextualPrompt(props: PromptConfig) {
  const { show, onDismiss } = useContextualPrompt(props);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg p-4 animate-slide-up">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{props.title}</h3>
        {props.dismissible !== false && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3">{props.content}</p>
      {props.action && (
        <button
          onClick={props.action.onClick}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {props.action.label}
        </button>
      )}
    </div>
  );
}
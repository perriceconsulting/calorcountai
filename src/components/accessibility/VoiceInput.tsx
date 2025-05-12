import React, { useState, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useToastStore } from '../feedback/Toast';

interface VoiceInputProps {
  onResult: (transcript: string) => void;
  placeholder?: string;
}

export function VoiceInput({ onResult, placeholder = "Click to start voice input" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { addToast } = useToastStore();

  const startListening = useCallback(() => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        addToast('Voice input is not supported in your browser', 'error');
        return;
      }

      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        addToast('Error processing voice input', 'error');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
      recognition.start();
      setIsListening(true);
      addToast('Listening...', 'info');
    } catch (error) {
      console.error('Voice input error:', error);
      addToast('Failed to start voice input', 'error');
    }
  }, [onResult, addToast]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isListening 
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      {isListening ? (
        <>
          <MicOff className="w-5 h-5" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Mic className="w-5 h-5" />
          <span>{placeholder}</span>
        </>
      )}
    </button>
  );
}
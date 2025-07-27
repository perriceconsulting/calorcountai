interface SuggestionsModalProps {
  isOpen: boolean;
  suggestions: string[];
  onClose: () => void;
}

export function SuggestionsModal({ isOpen, suggestions, onClose }: SuggestionsModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close suggestions"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Suggestions</h2>
        {suggestions.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {suggestions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No suggestions available.</p>
        )}
      </div>
    </div>
  );
}

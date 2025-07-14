import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface RecipeModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
}

export function RecipeModal({ isOpen, content, onClose }: RecipeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close recipe"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Recipe</h2>
        <div className="max-h-96 overflow-y-auto prose prose-lg prose-indigo">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

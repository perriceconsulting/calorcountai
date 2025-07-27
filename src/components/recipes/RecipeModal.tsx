import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';
import { ShoppingListModal } from './ShoppingListModal';
import { fetchShoppingList } from '../../services/recipeService';

interface RecipeModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
}

export function RecipeModal({ isOpen, content, onClose }: RecipeModalProps) {
  const [isListOpen, setListOpen] = useState(false);
  const [shoppingItems, setShoppingItems] = useState<string[]>([]);
  const [listLoading, setListLoading] = useState(false);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-xl w-full p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close recipe"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold mb-2">Recipe</h2>
          <button
            onClick={async () => {
              setListLoading(true);
              try {
                const items = await fetchShoppingList(content);
                setShoppingItems(items);
                setListOpen(true);
              } catch (err) {
                console.error('Failed to build shopping list:', err);
              } finally {
                setListLoading(false);
              }
            }}
            disabled={listLoading}
            className="mb-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {listLoading ? 'Generating List...' : 'Build Shopping List'}
          </button>
          <div className="max-h-96 overflow-y-auto prose prose-lg prose-indigo">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
      {isListOpen && (
        <ShoppingListModal
          isOpen={isListOpen}
          items={shoppingItems}
          onClose={() => setListOpen(false)}
        />
      )}
    </>
  );
}

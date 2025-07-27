interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  alt?: string;
  onClose: () => void;
}

export function ImageModal({ isOpen, imageUrl, alt = '', onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <img
        src={imageUrl}
        alt={alt}
        className="max-w-full max-h-full rounded shadow-lg cursor-zoom-out"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

import React from 'react';
import { StoredImage } from '../types';

interface ImageCardProps {
  image: StoredImage;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onReuse: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, isSelected, onSelect, onDelete, onReuse }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this image?")) {
        onDelete();
    }
  };

  const handleReuse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReuse();
  };
  
  const formattedDate = new Date(image.timestamp).toLocaleString();

  return (
    <div 
        className={`relative group bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-200 ${isSelected ? 'border-indigo-500 scale-105 shadow-2xl' : 'border-transparent hover:border-indigo-600 hover:shadow-lg'}`}
        onClick={onSelect}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
    >
      <img src={image.imageDataUrl} alt={image.prompt} className="w-full h-48 object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {isSelected && (
          <div className="absolute top-2 right-2 bg-indigo-600 rounded-full p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
          </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <p className="text-xs font-mono truncate" title={image.prompt}>{image.prompt}</p>
        <p className="text-xs text-gray-400">{formattedDate}</p>
      </div>

      <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
            <div className="flex gap-2">
                 <button onClick={handleReuse} title="Reuse" className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                 </button>
                 <button onClick={handleDelete} title="Delete" className="p-2 bg-red-600 rounded-full hover:bg-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                 </button>
            </div>
      </div>
    </div>
  );
};

export default ImageCard;

import React, { useState } from 'react';
import { StoredImage } from '../types';
import { createZipFromImages } from '../services/zipService';
import ImageCard from './ImageCard';
import Button from './common/Button';

interface HistoryProps {
  history: StoredImage[];
  onReuse: (image: StoredImage) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onReuse, onDelete, onClear }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };
  
  const handleDownload = async () => {
    if (selectedIds.size === 0) return;
    setError(null);
    setIsZipping(true);
    try {
        const selectedImages = history.filter(img => selectedIds.has(img.id));
        await createZipFromImages(selectedImages);
    } catch(err: any) {
        setError(err.message || "Failed to create zip file.");
    } finally {
        setIsZipping(false);
    }
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all images from your history? This action cannot be undone.")) {
      onClear();
      setSelectedIds(new Set());
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gray-800 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-xl font-medium text-white">Your History is Empty</h3>
        <p className="mt-2 text-gray-400">Start creating images in the "Generate" or "Remix" tabs, and they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <h2 className="text-lg font-bold text-white">Image History</h2>
                <p className="text-sm text-gray-400">{selectedIds.size} of {history.length} selected</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
                <Button onClick={handleDownload} disabled={selectedIds.size === 0 || isZipping} isLoading={isZipping}>
                    Download Selected
                </Button>
                <button 
                    onClick={handleClearHistory}
                    className="py-3 px-4 rounded-md text-sm font-medium bg-red-800 text-white hover:bg-red-700 disabled:bg-gray-500 transition-colors"
                >
                    Clear All
                </button>
            </div>
       </div>

       {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md">{error}</div>}

       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {history.map(image => (
            <ImageCard 
                key={image.id}
                image={image}
                isSelected={selectedIds.has(image.id)}
                onSelect={() => toggleSelection(image.id)}
                onDelete={() => onDelete(image.id)}
                onReuse={() => onReuse(image)}
            />
        ))}
       </div>
    </div>
  );
};

export default History;

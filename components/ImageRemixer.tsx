import React, { useState, useRef, useEffect } from 'react';
import { remixImage } from '../services/geminiService';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { StoredImage } from '../types';

interface RemixResult {
  imageUrl: string;
  text: string;
}

interface ImageRemixerProps {
  addImageToHistory: (image: Omit<StoredImage, 'id' | 'timestamp'>) => void;
  initialFile?: File | null;
  onDataConsumed?: () => void;
}

const ImageRemixer: React.FC<ImageRemixerProps> = ({ addImageToHistory, initialFile, onDataConsumed }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RemixResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, etc.).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
      setError('Image file size should not exceed 4MB.');
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  }

  useEffect(() => {
    if (initialFile) {
      updateFile(initialFile);
      setResult(null);
      setError(null);
      setPrompt('');
      onDataConsumed?.();
    }
  }, [initialFile, onDataConsumed]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
    if (!imageFile) {
      setError("Please select an image to remix.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const userPrompt = prompt.trim();
    const fullPrompt = `Enhance this image to be high-resolution and ultra-detailed, strictly maintaining the American Dad animation style. Apply the following change: "${userPrompt}". When the prompt is suggestive or foot-focused, pay special attention to rendering Francine's feet with beautiful, delicate, and anatomically correct detail. The final image must preserve the original's core composition and character likeness.`;

    try {
      const remixResult = await remixImage(fullPrompt, imageFile);
      setResult(remixResult);
      addImageToHistory({
        imageDataUrl: remixResult.imageUrl,
        prompt: userPrompt,
        type: 'remix',
      });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            1. Upload an image to remix
          </label>
          <div 
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
            onClick={triggerFileSelect}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files && e.dataTransfer.files[0]) updateFile(e.dataTransfer.files[0]); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <div className="space-y-1 text-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Image preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
              ) : (
                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div className="flex text-sm text-gray-400 justify-center">
                <p>{imageFile ? imageFile.name : 'Click or drag & drop to upload'}</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 4MB</p>
            </div>
          </div>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>

        <div>
          <label htmlFor="remix-prompt" className="block text-sm font-medium text-gray-300 mb-2">
            2. Describe how to change it
          </label>
          <textarea
            id="remix-prompt"
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
            placeholder="e.g., relaxing on a sofa with her feet up, getting a pedicure, wearing elegant high heels"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <Button type="submit" isLoading={isLoading} disabled={!prompt.trim() || !imageFile}>
          Remix Image
        </Button>
      </form>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md">{error}</div>}
      
      {isLoading && <Spinner message="Remixing your image..." />}

      {result && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
          <h3 className="text-lg font-semibold text-center">Your Remix</h3>
          <img src={result.imageUrl} alt="Remixed image" className="w-full max-w-lg mx-auto rounded-md" />
          <div className="bg-gray-900/50 p-4 rounded-md">
            <p className="text-gray-300 italic">Model's response:</p>
            <p className="text-white mt-1">{result.text}</p>
          </div>
           <a 
              href={result.imageUrl} 
              download="remixed-image.jpg" 
              className="mt-4 inline-block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
           >
              Download Remixed Image
            </a>
        </div>
      )}
    </div>
  );
};

export default ImageRemixer;

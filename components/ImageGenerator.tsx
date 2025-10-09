import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { AspectRatio, StoredImage } from '../types';

const basePrompt = "A high-resolution, full-color image of Francine Smith from American Dad. She is a tall, slender woman with blonde hair styled in a flip with a prominent side part, and a noticeable chin. The image must be in the distinct American Dad animation style, featuring clean, bold outlines and cel-shaded coloring. The scene should capture the show's comedic and slightly satirical tone.";

interface ImageGeneratorProps {
  addImageToHistory: (image: Omit<StoredImage, 'id' | 'timestamp'>) => void;
  initialData?: { prompt: string; aspectRatio: AspectRatio } | null;
  onDataConsumed?: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ addImageToHistory, initialData, onDataConsumed }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setPrompt(initialData.prompt);
      setAspectRatio(initialData.aspectRatio);
      setGeneratedImage(null);
      setError(null);
      onDataConsumed?.();
    }
  }, [initialData, onDataConsumed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const fullPrompt = `${basePrompt} The scene is: ${prompt.trim()}`;

    try {
      const imageUrl = await generateImage(fullPrompt, aspectRatio);
      setGeneratedImage(imageUrl);
      addImageToHistory({
        imageDataUrl: imageUrl,
        prompt: prompt.trim(),
        type: 'generate',
        aspectRatio,
      });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Describe a scene or situation for Francine
          </label>
          <textarea
            id="prompt"
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
            placeholder="e.g., dancing in the living room, wearing a red party dress"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
            <div className="flex space-x-3">
                 {Object.values(AspectRatio).map(ar => (
                     <button
                        key={ar}
                        type="button"
                        onClick={() => setAspectRatio(ar)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${aspectRatio === ar ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                     >{ar}</button>
                 ))}
            </div>
        </div>

        <Button type="submit" isLoading={isLoading} disabled={!prompt.trim()}>
          Generate Image
        </Button>
      </form>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md">{error}</div>}
      
      {isLoading && <Spinner />}

      {generatedImage && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Your Creation</h3>
          <img src={generatedImage} alt="Generated image of Francine" className="w-full max-w-lg mx-auto rounded-md" />
           <a 
              href={generatedImage} 
              download="francine-smith.jpg" 
              className="mt-4 inline-block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
           >
              Download Image
            </a>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;

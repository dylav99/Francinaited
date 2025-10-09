import React from 'react';
import { useState } from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import ImageRemixer from './components/ImageRemixer';
import TabSelector from './components/common/TabSelector';
import { AppMode, AspectRatio, StoredImage } from './types';
import RedistributionModal from './components/RedistributionModal';
import { useImageHistory } from './hooks/useImageHistory';
import History from './components/History';
import { dataURLtoFile } from './utils/fileUtils';


const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [isRedistributionModalOpen, setIsRedistributionModalOpen] = useState(false);
  const { history, addImageToHistory, removeImageFromHistory, clearHistory } = useImageHistory();

  // State to pass initial data when reusing from history
  const [initialGeneratorData, setInitialGeneratorData] = useState<{ prompt: string; aspectRatio: AspectRatio } | null>(null);
  const [initialRemixFile, setInitialRemixFile] = useState<File | null>(null);


  const handleReuse = (image: StoredImage) => {
    if (image.type === 'generate' && image.aspectRatio) {
      setInitialGeneratorData({ prompt: image.prompt, aspectRatio: image.aspectRatio });
      setMode(AppMode.GENERATE);
    } else {
      const file = dataURLtoFile(image.imageDataUrl, `remix-source-${Date.now()}.png`);
      setInitialRemixFile(file);
      setMode(AppMode.REMIX);
    }
  };


  const renderContent = () => {
    switch (mode) {
      case AppMode.GENERATE:
        return <ImageGenerator 
                  addImageToHistory={addImageToHistory} 
                  initialData={initialGeneratorData}
                  onDataConsumed={() => setInitialGeneratorData(null)}
                />;
      case AppMode.REMIX:
        return <ImageRemixer 
                  addImageToHistory={addImageToHistory}
                  initialFile={initialRemixFile}
                  onDataConsumed={() => setInitialRemixFile(null)}
                />;
      case AppMode.HISTORY:
        return <History 
                  history={history}
                  onReuse={handleReuse}
                  onDelete={removeImageFromHistory}
                  onClear={clearHistory}
                />;
      default:
        return <ImageGenerator addImageToHistory={addImageToHistory} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header onOpenRedistributionModal={() => setIsRedistributionModalOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <TabSelector selectedMode={mode} onSelectMode={setMode} />
          <div className="mt-8">
            {renderContent()}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Francine Image Studio. For mature audiences. Please use responsibly.</p>
      </footer>
      <RedistributionModal
        isOpen={isRedistributionModalOpen}
        onClose={() => setIsRedistributionModalOpen(false)}
      />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { AppMode } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TabSelector } from './components/TabSelector';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageRemixer } from './components/ImageRemixer';
import { RedistributionModal } from './components/RedistributionModal';
import { useImageHistory } from './hooks/useImageHistory';
import { ImageHistory } from './components/ImageHistory';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.GENERATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { history, addImageToHistory, clearHistory } = useImageHistory();

  useEffect(() => {
    // Show modal on first visit
    const hasSeenModal = localStorage.getItem('hasSeenDisclaimer');
    if (!hasSeenModal) {
      setIsModalOpen(true);
    }
  }, []);

  const handleCloseModal = () => {
    localStorage.setItem('hasSeenDisclaimer', 'true');
    setIsModalOpen(false);
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <main className="mt-8">
          <TabSelector currentMode={appMode} onModeChange={setAppMode} />
          <div className="p-6 bg-gray-800 rounded-b-lg shadow-xl border-t-0 border-gray-700">
            {appMode === AppMode.GENERATE && <ImageGenerator onImageGenerated={addImageToHistory} />}
            {appMode === AppMode.REMIX && <ImageRemixer onImageGenerated={addImageToHistory} />}
          </div>
        </main>
        <ImageHistory history={history} onClear={clearHistory} />
        <Footer onDisclaimerClick={handleOpenModal}/>
      </div>
      <RedistributionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default App;

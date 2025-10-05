import React from 'react';
import { useState } from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import ImageRemixer from './components/ImageRemixer';
import TabSelector from './components/common/TabSelector';
import { AppMode } from './types';
import RedistributionModal from './components/RedistributionModal';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [isRedistributionModalOpen, setIsRedistributionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header onOpenRedistributionModal={() => setIsRedistributionModalOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <TabSelector selectedMode={mode} onSelectMode={setMode} />
          <div className="mt-8">
            {mode === AppMode.GENERATE ? <ImageGenerator /> : <ImageRemixer />}
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
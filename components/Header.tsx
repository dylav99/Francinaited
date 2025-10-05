import React from 'react';

interface HeaderProps {
  onOpenRedistributionModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenRedistributionModal }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 3a1 1 0 112 0 1 1 0 01-2 0zm-3 5a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H9z"/>
            </svg>
            <h1 className="text-2xl font-bold tracking-tighter text-white">
                Francine Image Studio
            </h1>
        </div>
        
        <button
          onClick={onOpenRedistributionModal}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
          aria-label="Create redistribution model"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>Redistribute</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
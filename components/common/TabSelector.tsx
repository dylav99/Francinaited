
import React from 'react';
import { AppMode } from '../../types';

interface TabSelectorProps {
  selectedMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

const TabButton: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
  // Fix: Use React.ReactNode instead of JSX.Element to avoid namespace errors.
  icon: React.ReactNode;
}> = ({ label, isSelected, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
      isSelected
        ? 'bg-indigo-600 text-white shadow-md'
        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const TabSelector: React.FC<TabSelectorProps> = ({ selectedMode, onSelectMode }) => {
  return (
    <div className="grid grid-cols-2 gap-4 bg-gray-800 p-2 rounded-xl max-w-md mx-auto">
      <TabButton
        label="Generate New"
        isSelected={selectedMode === AppMode.GENERATE}
        onClick={() => onSelectMode(AppMode.GENERATE)}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>}
      />
      <TabButton
        label="Remix Image"
        isSelected={selectedMode === AppMode.REMIX}
        onClick={() => onSelectMode(AppMode.REMIX)}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>}
      />
    </div>
  );
};

export default TabSelector;
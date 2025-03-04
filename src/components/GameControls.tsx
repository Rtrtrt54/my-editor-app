import React from 'react';
import { RefreshCw } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  gameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, gameOver }) => {
  return (
    <div className="flex justify-center">
      <button
        className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
          gameOver 
            ? 'bg-indigo-600 text-white animate-pulse' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={onReset}
      >
        <RefreshCw size={18} className="mr-2" />
        {gameOver ? 'لعبة جديدة' : 'إعادة اللعبة'}
      </button>
    </div>
  );
};

export default GameControls;
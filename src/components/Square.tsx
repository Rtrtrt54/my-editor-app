import React from 'react';

interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinningSquare: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare }) => {
  const baseClasses = "w-full h-20 text-4xl font-bold flex items-center justify-center rounded-lg transition-all duration-200 transform hover:scale-105";
  
  // Different styling for X and O
  let colorClasses = "bg-gray-100 text-gray-400";
  
  if (value === 'X') {
    colorClasses = isWinningSquare 
      ? "bg-green-100 text-green-600" 
      : "bg-blue-100 text-blue-600";
  } else if (value === 'O') {
    colorClasses = isWinningSquare 
      ? "bg-green-100 text-green-600" 
      : "bg-red-100 text-red-600";
  }

  return (
    <button
      className={`${baseClasses} ${colorClasses}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
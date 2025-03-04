import React from 'react';
import Square from './Square';

interface BoardProps {
  squares: Array<string | null>;
  onClick: (i: number) => void;
  winningLine: number[];
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine }) => {
  const renderSquare = (i: number) => {
    const isWinningSquare = winningLine.includes(i);
    
    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {Array(9).fill(null).map((_, i) => (
        <div key={i}>
          {renderSquare(i)}
        </div>
      ))}
    </div>
  );
};

export default Board;
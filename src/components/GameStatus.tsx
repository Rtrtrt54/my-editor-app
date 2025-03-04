import React from 'react';

interface GameStatusProps {
  winner: { player: string, line?: number[] } | null;
  isXNext: boolean;
  gameMode: string;
  gameHistory: { X: number, O: number, tie: number };
}

const GameStatus: React.FC<GameStatusProps> = ({ winner, isXNext, gameMode, gameHistory }) => {
  let status;
  
  if (winner) {
    if (winner.player === 'tie') {
      status = 'تعادل!';
    } else {
      status = `الفائز: ${winner.player}`;
    }
  } else {
    status = `اللاعب التالي: ${isXNext ? 'X' : 'O'}`;
    
    // Add extra context for player vs computer mode
    if (gameMode === 'player_vs_computer' && !isXNext) {
      status = 'دور الكمبيوتر...';
    }
  }

  return (
    <div className="mb-6">
      <div className="text-xl font-bold text-center mb-2 text-indigo-700">
        {status}
      </div>
      
      {/* Game history */}
      <div className="flex justify-center gap-4 text-sm text-gray-600">
        <div className="text-center">
          <span className="font-bold text-blue-600">X</span>
          <p>{gameHistory.X}</p>
        </div>
        <div className="text-center">
          <span className="font-bold text-gray-600">تعادل</span>
          <p>{gameHistory.tie}</p>
        </div>
        <div className="text-center">
          <span className="font-bold text-red-600">O</span>
          <p>{gameHistory.O}</p>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
import React, { useState, useEffect } from 'react';
import { RefreshCw, User, Cpu } from 'lucide-react';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import GameControls from './components/GameControls';

// Game modes
const GAME_MODES = {
  PLAYER_VS_PLAYER: 'player_vs_player',
  PLAYER_VS_COMPUTER: 'player_vs_computer',
};

// Difficulty levels
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

function App() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState(GAME_MODES.PLAYER_VS_PLAYER);
  const [difficultyLevel, setDifficultyLevel] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [gameHistory, setGameHistory] = useState({ X: 0, O: 0, tie: 0 });

  // Check for winner or tie
  useEffect(() => {
    const calculatedWinner = calculateWinner(board);
    setWinner(calculatedWinner);

    // Computer's turn
    if (
      !calculatedWinner && 
      !isXNext && 
      gameMode === GAME_MODES.PLAYER_VS_COMPUTER && 
      !board.every(square => square !== null)
    ) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, gameMode]);

  // Calculate winner
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: lines[i] };
      }
    }

    // Check for tie
    if (squares.every(square => square !== null)) {
      return { player: 'tie' };
    }

    return null;
  };

  // Handle square click
  const handleClick = (i) => {
    if (winner || board[i] || (!isXNext && gameMode === GAME_MODES.PLAYER_VS_COMPUTER)) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Computer move based on difficulty
  const makeComputerMove = () => {
    if (winner) return;

    let move;
    switch (difficultyLevel) {
      case DIFFICULTY_LEVELS.EASY:
        move = getRandomMove();
        break;
      case DIFFICULTY_LEVELS.MEDIUM:
        // 50% chance of making a smart move
        move = Math.random() < 0.5 ? getSmartMove() : getRandomMove();
        break;
      case DIFFICULTY_LEVELS.HARD:
        move = getSmartMove();
        break;
      default:
        move = getRandomMove();
    }

    if (move !== null) {
      const newBoard = [...board];
      newBoard[move] = 'O';
      setBoard(newBoard);
      setIsXNext(true);
    }
  };

  // Get random valid move
  const getRandomMove = () => {
    const emptySquares = board
      .map((square, index) => (square === null ? index : null))
      .filter(index => index !== null);

    if (emptySquares.length === 0) return null;
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  // Get smart move (win if possible, block opponent, or best strategic move)
  const getSmartMove = () => {
    // Try to win
    const winMove = findWinningMove('O');
    if (winMove !== null) return winMove;

    // Block opponent from winning
    const blockMove = findWinningMove('X');
    if (blockMove !== null) return blockMove;

    // Take center if available
    if (board[4] === null) return 4;

    // Take corners
    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take any available move
    return getRandomMove();
  };

  // Find winning move for a player
  const findWinningMove = (player) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      // Check if we can win in this line
      if (
        board[a] === player && 
        board[b] === player && 
        board[c] === null
      ) {
        return c;
      }
      if (
        board[a] === player && 
        board[c] === player && 
        board[b] === null
      ) {
        return b;
      }
      if (
        board[b] === player && 
        board[c] === player && 
        board[a] === null
      ) {
        return a;
      }
    }

    return null;
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);

    // Update game history if there was a winner
    if (winner) {
      const newHistory = { ...gameHistory };
      if (winner.player === 'X') {
        newHistory.X += 1;
      } else if (winner.player === 'O') {
        newHistory.O += 1;
      } else if (winner.player === 'tie') {
        newHistory.tie += 1;
      }
      setGameHistory(newHistory);
    }
  };

  // Change game mode
  const handleGameModeChange = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  // Change difficulty level
  const handleDifficultyChange = (level) => {
    setDifficultyLevel(level);
    if (gameMode === GAME_MODES.PLAYER_VS_COMPUTER) {
      resetGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">لعبة XO</h1>
        
        {/* Game mode selection */}
        <div className="flex justify-center mb-6 gap-3">
          <button 
            className={`flex items-center px-4 py-2 rounded-lg ${gameMode === GAME_MODES.PLAYER_VS_PLAYER ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleGameModeChange(GAME_MODES.PLAYER_VS_PLAYER)}
          >
            <User size={18} className="mr-2" />
            لاعب ضد لاعب
          </button>
          <button 
            className={`flex items-center px-4 py-2 rounded-lg ${gameMode === GAME_MODES.PLAYER_VS_COMPUTER ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleGameModeChange(GAME_MODES.PLAYER_VS_COMPUTER)}
          >
            <Cpu size={18} className="mr-2" />
            لاعب ضد الكمبيوتر
          </button>
        </div>
        
        {/* Difficulty selection (only show when playing against computer) */}
        {gameMode === GAME_MODES.PLAYER_VS_COMPUTER && (
          <div className="mb-6">
            <p className="text-center mb-2 text-gray-700">مستوى الصعوبة:</p>
            <div className="flex justify-center gap-2">
              {Object.values(DIFFICULTY_LEVELS).map((level) => (
                <button
                  key={level}
                  className={`px-3 py-1 rounded ${difficultyLevel === level ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleDifficultyChange(level)}
                >
                  {level === 'easy' ? 'سهل' : level === 'medium' ? 'متوسط' : 'صعب'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game status */}
        <GameStatus 
          winner={winner} 
          isXNext={isXNext} 
          gameMode={gameMode} 
          gameHistory={gameHistory}
        />

        {/* Game board */}
        <Board 
          squares={board} 
          onClick={handleClick} 
          winningLine={winner?.line || []}
        />

        {/* Game controls */}
        <GameControls 
          onReset={resetGame} 
          gameOver={!!winner}
        />
      </div>
    </div>
  );
}

export default App;
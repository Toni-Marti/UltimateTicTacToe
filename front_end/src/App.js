import { useState } from 'react';
import { Game, Board, Tile, MARK } from './gameLogic';
import { GameR } from './gameComponents';

function App() {
  const [game, setGame] = useState(new Game(new Board(Array.from({ length: 9 }, () => new Board()))));
  return (
    <GameR game={game} boardSize="500" />
  );
}

export default App;

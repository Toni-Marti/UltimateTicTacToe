import { useState } from 'react';
import { Game, Board, Tile, MARK } from './gameLogic';
import { GameR } from './gameComponents';

function App() {
  return (
    <GameR boardSize="500" />
  );
}

export default App;

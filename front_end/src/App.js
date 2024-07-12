import React, { useRef } from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './Nav';

import { Game, Board, Tile, MARK } from './gameLogic';
import { GameR } from './gameComponents';
import Lobby from './Lobby';
import Login from './Login';


function App() {
  return (
    
    <Router>
        <div className='App'>
          <Nav />
          <div>
          <Routes>
            <Route path="/Game" element={<GameR boardSize="500" />}/>
            <Route path="/Lobby" element={<Lobby />}/>
            <Route path="/Login" element={<Login />}/>
          </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;

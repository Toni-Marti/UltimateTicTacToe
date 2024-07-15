import React, { useRef } from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './Nav';

import { GameR } from './gameComponents';
import GamePage from './GamePage';
import Lobby from './Lobby';
import Login from './Login';
import SignUp from './SignUp';
import TestPage from './TestPage';
import Chat from './Chat.js';
import { getUsername } from './FrontendCommons.js';


function App() {
  return (
    
    <Router>
        <div className='App'>
          <h1>Welcome {getUsername()}</h1>
          <Nav />
          <div>
          <Routes>
            <Route path="/Lobby" element={<Lobby />}/>
            <Route path="/Login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/GamePage" element={<GamePage />}/>
            <Route path="/Game" element={<GameR />}/>
            <Route path="/TestPage" element={<TestPage />} />
            <Route path="/Chat" element={<Chat />} />
          </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;

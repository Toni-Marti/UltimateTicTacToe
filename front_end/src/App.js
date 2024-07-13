import React, { useRef } from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './Nav';

import { GameR } from './gameComponents';
import Lobby from './Lobby';
import Login from './Login';
import SignUp from './SignUp';


function App() {
  return (
    
    <Router>
        <div className='App'>
          <Nav />
          <div>
          <Routes>
            <Route path="/Game" element={<GameR />}/>
            <Route path="/Lobby" element={<Lobby nPlayers={[["ExampleName1", "ExampleRules1"], ["ExampleName2", "ExampleRules2"]]} />}/>
            <Route path="/Login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
          </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;

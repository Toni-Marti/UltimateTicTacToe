import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client'
import Nav from './Nav';

import "./App.css"

import { GameR } from './gameComponents';
import GamePage from './GamePage';
import Lobby from './Lobby';
import Login from './Login';
import SignUp from './SignUp';
import TestPage from './TestPage';
import Chat from './Chat.js';
import { getUsername } from './FrontendCommons.js';
import { getServerAddress, getServerPort} from './serverData.js'


function App() {
  const [socket, setSocket] = useState(io(getServerAddress() + ':' + getServerPort(), {
                                        reconnectionAttempts: Infinity, reconnectionDelay: 5000, // 5 seconds
                                      }));

  useEffect(() => {
  
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      console.log('Suposedlly trying to reconnect');
    });
  
    // Cleanup function to run when the component unmounts
    return () => {
      console.log("Disconnecting from server");
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
        <div className='App'>
          <h1>Welcome {getUsername()}</h1>
          <Nav />
          <div>
          <Routes>
            <Route path="/Lobby" element={<Lobby socket={socket} />}/>
            <Route path="/Login" element={<Login socket={socket}/>} />
            <Route path="/SignUp" element={<SignUp socket={socket}/>} />
            <Route path="/GamePage" element={<GamePage socket={socket}/>}/>
            <Route path="/Game" element={<GameR />}/>
            <Route path="/TestPage" element={<TestPage socket={socket}/>} />
            <Route path="/Chat" element={<Chat socket={socket}/>} />
          </Routes>
          </div>
        </div>
    </Router>
  );
}

export default App;

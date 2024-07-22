import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

import "./App.css"

import { GameR } from './gameComponents';
import GamePage from './GamePage';
import Lobby from './Lobby';
import Login from './Login';
import SignUp from './SignUp';
import LocalMode from './LocalMode';
import TestPage from './TestPage';
import { getServerAddress, getServerPort} from './serverData.js'
import TopBar from './TopBar.js';
import handleLogout from './Logout';


const PAGES = Object.freeze({
  LOBBY: 'Lobby',
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  GAMEPAGE: 'GamePage',
  LOCALMODE: 'LocalMode',
  TEST: 'TestPage'
});


const socket = io(getServerAddress() + ':' + getServerPort(), {
  reconnectionAttempts: Infinity, reconnectionDelay: 5000, });

function App() {
  const [page, setPage] = useState(PAGES.LOBBY);
  const [userName, setUserName] = useState(localStorage.getItem('username') || 'guest');
  const [password, setPassword] = useState(localStorage.getItem('password') || '');
  const [gameRoom, setGameRoom] = useState(null);

  const changeUserName = (newUserName) => {
    localStorage.setItem('username', newUserName);
    setUserName(newUserName);
  };

  const changePassword = (newPassword) => {
    localStorage.setItem('password', newPassword);
    setPassword(newPassword);
  };

  useEffect(() => {
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      console.log('Supposedly trying to reconnect');
    });
  
    // Cleanup function to run when the component unmounts
    return () => {
      socket.off('disconnect');
    };
  }, []);

  function renderPage(page, socket) {
    switch (page) {
      case PAGES.LOBBY:
        return <Lobby socket={socket} changePage={setPage} userName={userName} password={password} setGameRoom={setGameRoom}/>;
      case PAGES.LOGIN:
        return <Login socket={socket} changePage={setPage} setUserName={changeUserName} setPassword={changePassword}/>;
      case PAGES.SIGNUP:
        return <SignUp socket={socket} changePage={setPage} setUserName={changeUserName} setPassword={changePassword}/>;
      case PAGES.GAMEPAGE:
        return <GamePage socket={socket} changePage={setPage} userName={userName} password={password} roomId={gameRoom}/>;
      case PAGES.LOCALMODE:
        return <LocalMode changePage={setPage}/>;
        case PAGES.TEST:
        return <TestPage socket={socket}/>;
      default:
        return null; // or a default page
    }
  }

  return (
    <div className='App'>
      <TopBar
        changePage={setPage}
        userName={userName}
        password={password}
        socket={socket}
        setUserName={setUserName} 
        setPassword={setPassword} 
        />
      {renderPage(page, socket)}
    </div>
  );
}

export default App;
export { PAGES };

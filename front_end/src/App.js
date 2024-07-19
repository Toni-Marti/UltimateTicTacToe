import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

import "./App.css"

import { GameR } from './gameComponents';
import GamePage from './GamePage';
import Lobby from './Lobby';
import Login from './Login';
import SignUp from './SignUp';
// import TestPage from './TestPage';
import { getServerAddress, getServerPort} from './serverData.js'
import TopBar from './TopBar.js';

const PAGES = Object.freeze({
  LOBBY: 'Lobby',
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  GAMEPAGE: 'GamePage',
  TEST: 'TestPage'
});


function App() {
  const [socket, setSocket] = useState(io(getServerAddress() + ':' + getServerPort(), {
                                        reconnectionAttempts: Infinity, reconnectionDelay: 5000, // 5 seconds
                                      }));
  const [page, setPage] = useState(PAGES.LOBBY);
  const [userName, setUserName] = useState(localStorage.getItem('username') || '');
  const [password, setPassword] = useState(localStorage.getItem('password') || '');

  const changeUserName = (newUserName) => {
    localStorage.setItem('username', newUserName);
    setUserName(newUserName);
  };

  const changePassword = (newPassword) => {
    localStorage.setItem('password', newPassword);
    setPassword(newPassword);
  };

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
      socket.off('connect');
      socket.off('disconnect');
      //console.log("Disconnecting from server");
      //socket.disconnect();
    };
  }, []);

  function renderPage(page, socket) {
    switch (page) {
      case PAGES.LOBBY:
        return <Lobby socket={socket} changePage={setPage} userName={userName} password={password}/>;
      case PAGES.LOGIN:
        return <Login socket={socket} changePage={setPage} setUserName={changeUserName} setPassword={changePassword}/>;
      case PAGES.SIGNUP:
        return <SignUp socket={socket} changePage={setPage} setUserName={changeUserName} setPassword={changePassword}/>;
      case PAGES.GAMEPAGE:
        return <GamePage socket={socket} changePage={setPage} userName={userName} password={password}/>;
      // case PAGES.TEST:
      //   return <TestPage socket={socket}/>;
      default:
        return null; // or a default page
    }
  }

  return (
    <div className='App'>
      <TopBar changePage={setPage} userName={userName}/> 
      {renderPage(page, socket)}
    </div>
  );
}

export default App;
export { PAGES };

import React, { useState, useEffect } from 'react';
import { MessagePopUp, Overlay } from './popUps.js';
import Stadistics from './Stadistics.js'

function User({userName, password, socket, size="", setPopUp}) {
  const [stats, setStats] = useState(null);

  

  function updatePopUp (losses, ties, wins) {
    setPopUp(
        <>
            <Overlay/>
            <MessagePopUp onClick={() => setPopUp(null)}>
                <div style={{color:'black'}}>
                    <span style={{fontWeight:"bolder", fontSize:"xx-large"}}> {userName} </span>
                    <br/>
                    <Stadistics loss={losses} draw={ties} win={wins}/>
                </div>
            </MessagePopUp>
        </>
    )
  }

  function updateStats (event) {
    event.stopPropagation();
    if(stats === null) {
        socket.once('userStats', (gameStats) => {
            setStats(gameStats);
            updatePopUp(gameStats.losses, gameStats.ties, gameStats.wins)
        })
        socket.emit('userStats', userName);
    }
    else {
        updatePopUp(stats.losses, stats.ties, stats.wins)
    }
  };

  return (
    <span onClick={updateStats} style={{fontWeight:'bold', cursor:'pointer', fontSize:size}}>{userName}</span>
  );
}

export default User;


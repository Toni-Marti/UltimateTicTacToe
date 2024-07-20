import React, { useState, useEffect } from 'react';
import { MessagePopUp, Overlay } from './popUps.js';
import Stadistics from './Stadistics.js'

function User({children, socket}) {
  const [popUp, setPopUp] = useState(null);
  const [stats, setStats] = useState(null);

  function updatePopUp (losses, ties, wins) {
    setPopUp(
        <>
            <Overlay/>
            <MessagePopUp onClick={() => setPopUp(null)}>
                User: {children}
                <Stadistics loss={losses} draw={ties} win={wins}/>
            </MessagePopUp>
        </>
    )
  }

  function updateStats () {
    if(stats === null) {
        socket.once('userStats', (userName, gameStats) => {
            setStats(gameStats);
            updatePopUp(gameStats.losses, gameStats.ties, gameStats.wins)
        })
        socket.emit('userStats', children);
    }
    else {
        updatePopUp(stats.losses, stats.ties, stats.wins)
    }
  };

  return (
    <>
        <span onClick={updateStats}>{children}</span>
        {popUp}

    </>
  );
}

export default User;


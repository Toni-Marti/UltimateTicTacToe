import React, { useState, useEffect } from 'react';
import {getUsername, getPassword} from './FrontendCommons.js'
import { GameR } from './gameComponents.js'
import Chat from './Chat.js'
import { useLocation } from 'react-router-dom';
import { PAGES } from './App.js';



function GamePage({socket})
{

    // Get parameter roomId
    const location = useLocation();
    const { roomId } = location.state || { roomId: 0 };

    return(
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <h1> Room id: {roomId} </h1>
                <GameR  />
            </div>
            <div style={{ flex: 1 }}>
                <Chat roomId={roomId} socket={socket}/>
            </div>
        </div>
    );
}

export default GamePage;
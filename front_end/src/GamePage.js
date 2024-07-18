import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {EVENTTYPE} from './commonsSymbolicLink/socketUtils.js'
import {getUsername, getPassword} from './FrontendCommons.js'
import { getServerAddress } from './serverData.js'
import { GameR } from './gameComponents.js'
import Chat from './Chat.js'
import { useLocation } from 'react-router-dom';


const socket = io( getServerAddress() + ':4000' )

function GamePage()
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
                <Chat roomId={roomId} />
            </div>
        </div>
    );
}

export default GamePage;
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {EVENTTYPE} from './commonsSymbolicLink/socketUtils.js'
import {getUsername, getPassword} from './FrontendCommons.js'
import { getServerAddress } from './serverData.js'
import { GameR } from './gameComponents.js'
import Chat from './Chat.js'

const socket = io( getServerAddress() + ':4000' )

function GamePage(roomId)
{
    

    return(
        <div style={{ display: 'flex' }}>
            <GameR />
            <div style={{ flex: 1 }}>
                <Chat roomId={roomId} />
            </div>
        </div>
    );
}

export default GamePage;
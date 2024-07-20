import React, { useState, useEffect } from 'react';
import { GameR } from './gameComponents.js'
import { Game } from './commonsSymbolicLink/gameLogic.js';
import Chat from './Chat.js'
import { PAGES } from './App.js';

import './GamePage.css'

function GamePage({socket, roomId}) {
    const [game, setGame] = useState(new Game());
    const [myTurn, setMyTurn] = useState(false);

    useEffect(() => {
        socket.on("updateGame", (game, canPlay) => {
            setGame(Game.fromJSON(game));
            setMyTurn(canPlay);
        });
        socket.emit('ready', roomId);
    }, [])

    return(
        <div className="GamePage">
            <GameR game={game} isMyTyrn={myTurn} setLastMove={(move) => socket.emit("move", move)}/>
            <Chat roomId={roomId} socket={socket}/>
        </div>
    );
}

export default GamePage;